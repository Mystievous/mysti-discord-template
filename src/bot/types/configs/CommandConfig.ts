import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { ClientExtended } from 'scripts/ClientExtended';
 
export interface CommandConfig {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (client: ClientExtended, interaction: ChatInputCommandInteraction) => void;
}

