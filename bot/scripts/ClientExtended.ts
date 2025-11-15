import { Client, Collection } from "discord.js";
import type { ClientOptions, ComponentType } from "discord.js";

import type {
  ContextMenuCommandConfig,
  SlashCommandConfig,
  SubcommandsCommandConfig,
} from "app/scripts/bot_structures/CommandConfig";
import type { ComponentConfig } from "app/scripts/bot_structures/ComponentConfig";

export class ClientExtended extends Client {
  slashCommands = new Collection<
    string,
    SlashCommandConfig | SubcommandsCommandConfig
  >();
  contextMenuCommands = new Collection<string, ContextMenuCommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();

  constructor(options: ClientOptions) {
    super(options);
  }
}
