import { Client, Collection, ComponentType } from "discord.js";
import { ContextMenuCommandConfig, SlashCommandConfig } from "types/configs/CommandConfig";
import { ClientOptions } from "discord.js";
import { ComponentConfig } from "app/scripts/ComponentConfig";
import mysql from 'mysql2/promise';

export class ClientExtended extends Client {
  slashCommands = new Collection<string, SlashCommandConfig>();
  contextMenuCommands = new Collection<string, ContextMenuCommandConfig>();
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
