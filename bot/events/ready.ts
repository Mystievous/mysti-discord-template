import { Events } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";

export default makeEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
});
