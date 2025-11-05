import fs from "node:fs";
import path from "node:path";
import {
  ClientOptions,
  Collection,
  ContextMenuCommandBuilder,
  GatewayIntentBits,
  SlashCommandBuilder,
} from "discord.js";
import dotenv from "dotenv";

import { ClientExtended } from "scripts/ClientExtended";
import { EventConfig } from "types/configs/EventConfig";
import { ComponentConfig } from "scripts/ComponentConfig";

dotenv.config({
  path: "./envs/.env",
});

const token = process.env.TOKEN;

if (!token) {
  throw new Error("Bot token is not defined in environment variables");
}

const discordClientOptions: ClientOptions = {
  intents: [GatewayIntentBits.Guilds],
};

const client = new ClientExtended(discordClientOptions);

const includeExamples =
  process.env.INCLUDE_EXAMPLES &&
  process.env.INCLUDE_EXAMPLES.toLowerCase() === "true";

async function init() {
  const commandFoldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(commandFoldersPath);

  for (const folder of commandFolders) {
    if (folder === "example" && !includeExamples) {
      continue;
    }
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = (await import(filePath)).default;
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        if (command.data instanceof SlashCommandBuilder) {
          client.slashCommands.set(command.data.name, command);
        } else if (command.data instanceof ContextMenuCommandBuilder) {
          client.contextMenuCommands.set(command.data.name, command);
        }
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
    if (folder === "example" && !includeExamples) {
      continue;
    }
    const componentsPath = path.join(componentFoldersPath, folder);
    const componentsFiles = fs
      .readdirSync(componentsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of componentsFiles) {
      const filePath = path.join(componentsPath, file);
      const component = (await import(filePath)).default;
      // Set a new item in the Collection with the key as the component name and the value as the exported module
      if ("type" in component && "id" in component && "builder" in component) {
        const componentTypeCollection: Collection<string, ComponentConfig> =
          client.components.get(component.type) ??
          new Collection<string, ComponentConfig>();
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

init().then(() => client.login(token));
