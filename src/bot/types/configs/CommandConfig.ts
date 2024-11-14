import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { ClientExtended } from 'scripts/ClientExtended';
 
export interface CommandConfig {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandBuilder
  execute: (client: ClientExtended, interaction: ChatInputCommandInteraction) => void;
}

