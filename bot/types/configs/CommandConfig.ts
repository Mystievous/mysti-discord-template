import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { ClientExtended } from "scripts/ClientExtended";

export interface SlashCommandConfig {
  global?: boolean;
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
  global?: boolean;
  data: ContextMenuCommandBuilder;
  execute: (
    client: ClientExtended,
    interaction: ContextMenuCommandInteraction
  ) => void;
}

export type CommandConfig =
  | SlashCommandConfig
  | ContextMenuCommandConfig;
