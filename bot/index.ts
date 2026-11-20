import fs from "node:fs";
import path from "node:path";
import {
  Awaitable,
  ClientOptions,
  Collection,
  GatewayIntentBits,
} from "discord.js";

import { isEventConfig } from "app/scripts/bot_structures/EventConfig";
import {
  ComponentConfig,
  isComponentConfig,
} from "app/scripts/bot_structures/ComponentConfig";
import { isCommandConfig } from "app/scripts/bot_structures/CommandConfig";
import { loadDefaultExports } from "app/scripts/loadDefaultExports";
import { ClientExtended } from "app/scripts/ClientExtended";

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
    for (const command of await loadDefaultExports(
      commandsPath,
      isCommandConfig,
    )) {
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if (command.type === "slash") {
        client.slashCommands.set(command.data.name, command);
      } else if (command.type === "subcommand") {
        client.slashCommands.set(command.data.name, command);
      } else if (command.type === "context-menu") {
        client.contextMenuCommands.set(
          `${command.contextType}:${command.data.name}`,
          command,
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
    for (const component of await loadDefaultExports(
      componentsPath,
      isComponentConfig,
    )) {
      // Set a new item in the Collection with the key as the component name and the value as the exported module
      const componentTypeCollection: Collection<string, ComponentConfig> =
        client.components.get(component.type) ??
        new Collection<string, ComponentConfig>();
      componentTypeCollection.set(component.id, component);
      client.components.set(component.type, componentTypeCollection);
    }
  }

  const eventsPath = path.join(__dirname, "events");
  for (const event of await loadDefaultExports(eventsPath, isEventConfig)) {
    // discord.js passes the arguments that match `event.name`.
    // Typescript can't connect the two for an event loaded at runtime, so we cast.
    type EventHandler = (
      client: ClientExtended,
      ...args: unknown[]
    ) => Awaitable<void>;
    const execute = event.execute as EventHandler;

    const listener = async (...args: unknown[]) => {
      try {
        await execute(client, ...args);
      } catch (error) {
        console.error(`[event ${event.name}] Handler failed:`, error);
      }
    };

    if (event.once) {
      client.once(event.name, (...args) => void listener(...args));
    } else {
      client.on(event.name, (...args) => void listener(...args));
    }
  }
}

init()
  .then(() => client.login(token))
  .catch(console.error);
