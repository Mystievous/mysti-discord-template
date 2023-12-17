import fs from "node:fs";
import path from "node:path";
import { Collection, GatewayIntentBits } from "discord.js";

import { ClientExtended } from "scripts/ClientExtended";
import { EventConfig } from "types/configs/EventConfig";
import { ComponentConfig } from "./types/configs/components/ComponentConfig";

const { HOST, PORT, DATABASE, USERNAME, PASSWORD } = process.env;


if (HOST === undefined || PORT === undefined || Number.isNaN(parseInt(PORT)) || DATABASE === undefined || USERNAME === undefined || PASSWORD === undefined) {
  throw new Error("Database config is invalid.");
}

const certPath = path.join(__dirname, "ca-certificate.crt");
if (!fs.existsSync(certPath)) {
  console.error("Please put ca-certificate for database in the bot's root folder.")
  process.exit();
}

const client = new ClientExtended(
  {
    intents: [GatewayIntentBits.Guilds],
  },
  {
    host: HOST,
    port: parseInt(PORT),
    database: DATABASE,
    user: USERNAME,
    password: PASSWORD,
    ssl: {
      ca: fs.readFileSync(certPath).toString()
    },
  }
);

async function init() {
  const commandFoldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(commandFoldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = (await import(filePath)).default;
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  const componentFoldersPath = path.join(__dirname, "components");
  const componentFolders = fs.readdirSync(componentFoldersPath);

  for (const folder of componentFolders) {
    const componentsPath = path.join(componentFoldersPath, folder);
    const componentsFiles = fs
      .readdirSync(componentsPath) 
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of componentsFiles) {
      const filePath = path.join(componentsPath, file);
      const component = (await import(filePath)).default;
      // Set a new item in the Collection with the key as the component name and the value as the exported module
      if ("type" in component && "id" in component && "builder" in component) {
        const componentTypeCollection: Collection<string, ComponentConfig> = client.components.get(component.type) ?? new Collection<string, ComponentConfig>();
        componentTypeCollection.set(component.id, component);
        client.components.set(component.type, componentTypeCollection);
      } else {
        console.log(
          `[WARNING] The component at ${filePath} is missing a required "type", "id", or "builder" property.`
        );
      }
    }
  }

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event: EventConfig = (await import(filePath)).default;
    if (event.once) {
      client.once(event.name, (...args) => {
        event.execute(client, ...args);
      });
    } else {
      client.on(event.name, (...args) => {
        event.execute(client, ...args);
      });
    }
  }
}

init().then(() => client.login(process.env.TOKEN));
