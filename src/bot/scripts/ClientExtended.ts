import { Client, Collection } from "discord.js";
import { CommandConfig } from "types/CommandConfig";
import { ClientOptions } from "discord.js";

export class ClientExtended extends Client {
  commands = new Collection<string, CommandConfig>();

  constructor(options: ClientOptions) {
    super(options);
  }

}