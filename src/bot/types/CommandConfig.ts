import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ClientExtended } from 'app/scripts/ClientExtended';
 
export interface CommandConfig {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (client: ClientExtended, interaction: ChatInputCommandInteraction) => void;
}