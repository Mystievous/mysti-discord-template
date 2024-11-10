import { Client, Collection, ComponentType } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";
import { ClientOptions } from "discord.js";
import { ComponentConfig } from "app/types/configs/components/ComponentConfig";
import mysql from 'mysql2/promise';

export class ClientExtended extends Client {
  commands = new Collection<string, CommandConfig>();
  components = new Collection<
    ComponentType,
    Collection<string, ComponentConfig>
  >();
  database?: mysql.Connection;

  constructor(options: ClientOptions, databaseConfig: mysql.ConnectionOptions) {
    super(options);
    mysql.createConnection(databaseConfig).then((connection: mysql.Connection) => {
      this.database = connection;
    })
  }
}
