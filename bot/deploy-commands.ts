import {
  isCommandConfig,
  toCommandJSON,
} from "app/scripts/bot_structures/CommandConfig";
import {
  ApplicationIntegrationType,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import fs from "fs";
import path from "path";
import { loadDefaultExports } from "app/scripts/loadDefaultExports";

type JSONBody = RESTPostAPIApplicationCommandsJSONBody;

// Deploy Commands
async function deployCommands() {
  const token = process.env.TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId || !guildId) {
    throw new Error("Environment variables are invalid");
  }

  const includeExamples =
    process.env.INCLUDE_EXAMPLES &&
    process.env.INCLUDE_EXAMPLES.toLowerCase() === "true";

  const commands: Record<string, JSONBody[]> = {
    [guildId]: [],
  };
  const globalCommands: JSONBody[] = [];

  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  let count = 0;

  for (const folder of commandFolders) {
    if (folder === "example" && !includeExamples) {
      continue;
    }
    // Grab all the command files from the commands directory
    const commandsPath = path.join(foldersPath, folder);

    for (const command of await loadDefaultExports(
      commandsPath,
      isCommandConfig,
    )) {
      const data = toCommandJSON(command);
      if (
        !command.global &&
        data.integration_types?.includes(ApplicationIntegrationType.UserInstall)
      ) {
        console.warn(
          `[deploy] /${data.name} is user-installable but not global. It will only be available in ${guildId}`,
        );
      }
      if (command.global) {
        globalCommands.push(data);
      } else {
        commands[guildId]?.push(data);
      }
      count++;
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST({
    version: "10",
  }).setToken(token);
  try {
    console.log(`Started refreshing ${count} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    for (const id in commands) {
      const guildCommands = commands[id];
      await rest.put(Routes.applicationGuildCommands(clientId, id), {
        body: guildCommands,
      });
    }

    await rest.put(Routes.applicationCommands(clientId), {
      body: globalCommands,
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    // Catch and log any errors
    console.error("[deploy] Failed to deploy commands:", error);
  }
}

deployCommands().catch(console.error);
