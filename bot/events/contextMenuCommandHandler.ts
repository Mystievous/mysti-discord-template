import { Events } from "discord.js";

import { activeInteraction } from "app/scripts/activeInteraction";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { UserMessages } from "app/scripts/messages";
import { universalRespond } from "app/scripts/universalRespond";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (
      !interaction.isMessageContextMenuCommand() &&
      !interaction.isUserContextMenuCommand()
    )
      return;

    const command = client.contextMenuCommands.get(
      `${interaction.commandType}:${interaction.commandName}`,
    );

    if (!command) {
      console.error(
        `[command /${interaction.commandName}] No handler registered.`,
      );
      await universalRespond(interaction, UserMessages.unavailable);
      return;
    }

    const context = { current: interaction };
    try {
      await activeInteraction.run(context, () =>
        command.execute(client, interaction),
      );
    } catch (error) {
      console.error(
        `[command /${interaction.commandName}] Execution failed:`,
        error,
      );
      await universalRespond(context.current, UserMessages.failed);
    }
  },
});
