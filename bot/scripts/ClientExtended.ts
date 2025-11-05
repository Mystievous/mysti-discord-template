import { Client, Collection } from "discord.js";
import type { ClientOptions, ComponentType } from "discord.js";

import type {
  ContextMenuCommandConfig,
  SlashCommandConfig,
} from "types/configs/CommandConfig";
import type { ComponentConfig } from "scripts/ComponentConfig";

export class ClientExtended extends Client {
  slashCommands = new Collection<string, SlashCommandConfig>();
  contextMenuCommands = new Collection<string, ContextMenuCommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();

  constructor(options: ClientOptions) {
    super(options);
  }
}
