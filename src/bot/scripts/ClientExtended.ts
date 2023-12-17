import { Client, Collection, ComponentType } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";
import { ClientOptions } from "discord.js";
import { ComponentConfig } from "app/types/configs/components/ComponentConfig";
import pg from "pg";
export class ClientExtended extends Client {
  commands = new Collection<string, CommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();
  database: pg.Client;

  private databaseConnected = false;

  constructor(options: ClientOptions, databaseConfig: pg.ClientConfig) {
    super(options);
    this.database = new pg.Client(databaseConfig);
    this.connectDB();
  }

  async connectDB() {
    await this.database.connect();
    this.databaseConnected = true;
  }

  isDatabaseConnected() {
    return this.databaseConnected;
  }
}
