import { Client, Collection } from "discord.js";
import { CommandConfig } from "app/types/CommandConfig";
import { ClientOptions } from "discord.js";

export interface ClientOptionsExtended extends ClientOptions {

}

export class ClientExtended extends Client {
  commands = new Collection<string, CommandConfig>();

  constructor(options: ClientOptionsExtended) {
    super(options);
  }

}