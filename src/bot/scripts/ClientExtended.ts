import { Client, Collection, ComponentType } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";
import { ClientOptions } from "discord.js";
import { ComponentConfig } from "app/types/configs/components/ComponentConfig";
export class ClientExtended extends Client {
  commands = new Collection<string, CommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();

  constructor(options: ClientOptions) {
    super(options);
  }
}
