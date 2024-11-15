import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { ClientExtended } from "scripts/ClientExtended";

export interface SlashCommandConfig {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    client: ClientExtended,
    interaction: ChatInputCommandInteraction
  ) => void;
}

export interface ContextMenuCommandConfig {
  data: ContextMenuCommandBuilder;
  execute: (
    client: ClientExtended,
    interaction: ContextMenuCommandInteraction
  ) => void;
}

export type CommandConfig =
  | SlashCommandConfig
  | ContextMenuCommandConfig;
