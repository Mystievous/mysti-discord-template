import { Events } from "discord.js";
import { EventConfig } from "app/types/EventConfig";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
} as EventConfig;
