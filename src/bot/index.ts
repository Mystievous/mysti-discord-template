import fs from "node:fs";
import path from "node:path";
import { GatewayIntentBits } from "discord.js";

import { ClientExtended } from "app/scripts/ClientExtended";
import { EventConfig } from "app/types/EventConfig";

const client = new ClientExtended({
  intents: [GatewayIntentBits.Guilds],
});

async function init() {
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs
    .readdirSync(foldersPath);


  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
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
