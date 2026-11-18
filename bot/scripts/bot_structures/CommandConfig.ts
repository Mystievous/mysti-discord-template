import { ApplicationCommandType } from "discord.js";
import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import type { ClientExtended } from "scripts/ClientExtended";

type CommandBuilder = { toJSON: () => unknown };
const COMMAND_TYPES = ["slash", "subcommand", "context-menu"] as const;
type CommandType = (typeof COMMAND_TYPES)[number];
const COMMAND_TYPE_SET: ReadonlySet<unknown> = new Set(COMMAND_TYPES);

export interface CommandConfig<
  Builder extends CommandBuilder = CommandBuilder,
> {
  type?: CommandType;
  global?: boolean;
  data: Builder;
}

export interface ExecutableCommandConfig<
  Builder extends CommandBuilder = CommandBuilder,
  Interaction = unknown,
> extends CommandConfig<Builder> {
  execute: (client: ClientExtended, interaction: Interaction) => Promise<void>;
}

export type AutocompleteHandler = (
  client: ClientExtended,
  interaction: AutocompleteInteraction,
) => Promise<void>;

//
// Slash Command Configuration
//

export interface SlashCommandConfig extends ExecutableCommandConfig<
  SlashCommandOptionsOnlyBuilder,
  ChatInputCommandInteraction
> {
  type: "slash";
  autocomplete?: AutocompleteHandler;
}

export function makeSlashCommand(
  config: Omit<SlashCommandConfig, "type">,
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
    >,
  ) => unknown;
  execute: (
    client: ClientExtended,
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>;
  autocomplete?: AutocompleteHandler;
}

export interface SubcommandGroup extends SubcommandBase {
  type: "group";
  subcommands: Record<string, SubcommandCommand>;
}

export type SubcommandOrGroup = SubcommandCommand | SubcommandGroup;

export interface SubcommandsCommandConfig extends CommandConfig<SlashCommandSubcommandsOnlyBuilder> {
  type: "subcommand";
  subcommands: Record<string, SubcommandOrGroup>;
}

export function makeSubcommandCommand(
  config: Omit<SubcommandsCommandConfig, "type">,
): SubcommandsCommandConfig {
  return {
    ...config,
    type: "subcommand",
  };
}

// Applies one subcommand's name, description, and options to `sub`
function applySubcommand(
  sub: SlashCommandSubcommandBuilder,
  name: string,
  config: SubcommandCommand,
): SlashCommandSubcommandBuilder {
  sub.setName(name).setDescription(config.description);
  config.builder?.(sub);
  return sub;
}

// Adds the subcommands onto `command.data` itself, so call this only once per command.
export function buildSubcommandData(command: SubcommandsCommandConfig) {
  const subcommandData = command.data;

  for (const [name, subcommand] of Object.entries(command.subcommands)) {
    if (subcommand.type === "command") {
      subcommandData.addSubcommand((sub) =>
        applySubcommand(sub, name, subcommand),
      );
    }

    if (subcommand.type === "group") {
      subcommandData.addSubcommandGroup((group) => {
        group.setName(name);
        group.setDescription(subcommand.description);

        for (const [subName, subcommandCommand] of Object.entries(
          subcommand.subcommands,
        )) {
          group.addSubcommand((sub) =>
            applySubcommand(sub, subName, subcommandCommand),
          );
        }

        return group;
      });
    }
  }

  return subcommandData;
}

export function resolveSubcommand(
  command: SubcommandsCommandConfig,
  groupName: string | null,
  subcommandName: string | null,
): SubcommandCommand | undefined {
  if (!subcommandName) return undefined;
  let parent: SubcommandsCommandConfig | SubcommandGroup = command;
  if (groupName) {
    const group = command.subcommands[groupName];
    if (!group || group.type !== "group") return undefined;
    parent = group;
  }
  const subcommand = parent.subcommands[subcommandName];
  return subcommand?.type === "command" ? subcommand : undefined;
}

//
// Context Menu Command Configuration
//

type ContextMenuKind =
  | ApplicationCommandType.Message
  | ApplicationCommandType.User;

type ContextMenuInteractionFor<K extends ContextMenuKind> =
  K extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction
    : UserContextMenuCommandInteraction;

export interface ContextMenuCommandConfig<
  K extends ContextMenuKind = ContextMenuKind,
> extends ExecutableCommandConfig<
  ContextMenuCommandBuilder,
  ContextMenuInteractionFor<K>
> {
  type: "context-menu";
  contextType: K;
}

// The maker sets the builder's type, so it always matches the interaction type
function contextMenuMaker<K extends ContextMenuKind>(contextType: K) {
  return (
    config: Omit<ContextMenuCommandConfig<K>, "type" | "contextType">,
  ): ContextMenuCommandConfig<K> => ({
    ...config,
    type: "context-menu",
    contextType,
    data: config.data.setType(contextType),
  });
}

export const makeMessageContextMenuCommand = contextMenuMaker(
  ApplicationCommandType.Message,
);
export const makeUserContextMenuCommand = contextMenuMaker(
  ApplicationCommandType.User,
);

//
// Types Union
//

export type AnyCommandConfig =
  | SlashCommandConfig
  | SubcommandsCommandConfig
  | ContextMenuCommandConfig;

export function toCommandJSON(
  command: AnyCommandConfig,
): RESTPostAPIApplicationCommandsJSONBody {
  switch (command.type) {
    case "slash":
    case "context-menu":
      return command.data.toJSON();
    case "subcommand":
      return buildSubcommandData(command).toJSON();
  }
}

//
// Helper Function
//

// Runtime check for a command file's type
export function isCommandConfig(value: unknown): value is AnyCommandConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    COMMAND_TYPE_SET.has(value.type) &&
    "data" in value
  );
}
