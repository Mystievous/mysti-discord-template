import { CommandConfig } from "types/configs/CommandConfig";
import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

dotenv.config({
  path: "./envs/.env",
});

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error("Environment variables are invalid");
}

const includeExamples =
  process.env.INCLUDE_EXAMPLES &&
  process.env.INCLUDE_EXAMPLES.toLowerCase() === "true";

const commands: { [guildId: string]: any[] } = {};
const globalCommands: any[] = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

let count = 0;

for (const folder of commandFolders) {
  if (folder === "example" && !includeExamples) {
    continue;
  }
  // Grab all the command files from the commands directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));
  commands[guildId] = commands[guildId] ?? [];

  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const commandPath = path.join(commandsPath, file);
    const command: CommandConfig = require(commandPath).default;
    if (command.global) {
      globalCommands.push(command.data.toJSON());
    } else {
      commands[guildId].push(command.data.toJSON());
    }
    count++;
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({
  version: "10",
}).setToken(token);

// Deploy Commands
(async () => {
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
    console.error(error);
  }
})();
