import type {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { ClientExtended } from "scripts/ClientExtended";

type CommandBuilder = { toJSON: () => any };
type CommandType = "slash" | "subcommand" | "context-menu";

export interface CommandConfig<
  Builder extends CommandBuilder = CommandBuilder
> {
  type?: CommandType;
  global?: boolean;
  data: Builder;
}

export interface ExecutableCommandConfig<
  Builder extends CommandBuilder = CommandBuilder,
  Interaction = any
> extends CommandConfig<Builder> {
  execute: (client: ClientExtended, interaction: Interaction) => Promise<void>;
}

//
// Slash Command Configuration
//

export interface SlashCommandConfig
  extends ExecutableCommandConfig<
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandOptionsOnlyBuilder,
    ChatInputCommandInteraction
  > {
  type: "slash";
}

export function makeSlashCommand(
  config: Omit<SlashCommandConfig, "type">
): SlashCommandConfig {
  return {
    ...config,
    type: "slash",
  };
}

//
// Subcommands Command Configuration
//

export interface SubcommandBase {
  type: "command" | "group";
  description: string;
}

export interface SubcommandCommand extends SubcommandBase {
  type: "command";
  builder?: (
    subcommand: Omit<
      SlashCommandSubcommandBuilder,
      "setName" | "setDescription"
    >
  ) => Omit<SlashCommandSubcommandBuilder, "setName" | "setDescription">;
  execute: (
    client: ClientExtended,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}

export interface SubcommandGroup extends SubcommandBase {
  type: "group";
  subcommands: {
    [key: string]: SubcommandCommand;
  };
}

export type SubcommandOrGroup = SubcommandCommand | SubcommandGroup;

export interface SubcommandsCommandConfig
  extends CommandConfig<
    Omit<
      SlashCommandSubcommandBuilder | SlashCommandSubcommandsOnlyBuilder,
      "addSubcommand" | "addSubcommandGroup"
    >
  > {
  type: "subcommand";
  subcommands: Record<string, SubcommandOrGroup>;
}

export function makeSubcommand(
  config: Omit<SubcommandsCommandConfig, "type" | "execute">
): SubcommandsCommandConfig {
  return {
    ...config,
    type: "subcommand",
  };
}

export function buildSubcommandData(command: SubcommandsCommandConfig) {
  const subcommandData = command.data as SlashCommandSubcommandsOnlyBuilder;

  if (command.subcommands) {
    for (const [name, subcommand] of Object.entries(command.subcommands)) {
      if (subcommand.type === "command") {
        subcommandData.addSubcommand((sub) => {
          sub.setName(name);
          if (subcommand.description) {
            sub.setDescription(subcommand.description);
          }
          if (subcommand.builder) {
            return subcommand.builder(sub) as SlashCommandSubcommandBuilder;
          }
          return sub;
        });
      }

      if (subcommand.type === "group") {
        subcommandData.addSubcommandGroup((group) => {
          group.setName(name);
          if (subcommand.description) {
            group.setDescription(subcommand.description);
          }

          for (const [subName, subcommandCommand] of Object.entries(
            subcommand.subcommands
          )) {
            group.addSubcommand((sub) => {
              sub.setName(subName);
              if (subcommandCommand.description) {
                sub.setDescription(subcommandCommand.description);
              }
              if (subcommandCommand.builder) {
                return subcommandCommand.builder(
                  sub
                ) as SlashCommandSubcommandBuilder;
              }
              return sub;
            });
          }

          return group;
        });
      }
    }
  }

  return subcommandData;
}

//
// Context Menu Command Configuration
//

export interface ContextMenuCommandConfig
  extends ExecutableCommandConfig<
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction
  > {
  type: "context-menu";
}

export function makeContextMenuCommand(
  config: Omit<ContextMenuCommandConfig, "type">
): ContextMenuCommandConfig {
  return {
    ...config,
    type: "context-menu",
  };
}

//
// Types Union
//

export type AnyCommandConfig =
  | SlashCommandConfig
  | SubcommandsCommandConfig
  | ContextMenuCommandConfig;

export const CommandBuilderFactories = {
  slash: (command: SlashCommandConfig) => {
    const builder = command.data;
    return builder;
  },
  subcommand: (command: SubcommandsCommandConfig) => {
    const builder = buildSubcommandData(command);
    return builder;
  },
  "context-menu": (command: ContextMenuCommandConfig) => {
    const builder = command.data;
    return builder;
  },
} as const;
