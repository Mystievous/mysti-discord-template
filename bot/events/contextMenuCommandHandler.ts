import { Events } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { universalRespond } from "app/scripts/universalRespond";
import { UserMessages } from "app/scripts/messages";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isContextMenuCommand()) return;

    const command = client.contextMenuCommands.get(interaction.commandName);

    if (!command) {
      console.error(
        `[command /${interaction.commandName}] No handler registered.`,
      );
      await universalRespond(interaction, UserMessages.unavailable);
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(
        `[command /${interaction.commandName}] Execution failed:`,
        error,
      );
      await universalRespond(interaction, UserMessages.failed);
    }
  },
});
