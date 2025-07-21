import { Client, Collection } from "discord.js";
import type { ClientOptions, ComponentType } from "discord.js";

import axios from "axios";
import type { CreateAxiosDefaults, AxiosInstance } from "axios";

import type {
  ContextMenuCommandConfig,
  SlashCommandConfig,
} from "types/configs/CommandConfig";
import type { ComponentConfig } from "app/scripts/ComponentConfig";

export class ClientExtended extends Client {
  slashCommands = new Collection<string, SlashCommandConfig>();
  contextMenuCommands = new Collection<string, ContextMenuCommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();
  api: AxiosInstance;

  constructor(options: ClientOptions, apiOptions: CreateAxiosDefaults) {
    super(options);
    this.api = axios.create(apiOptions);
  }
}
