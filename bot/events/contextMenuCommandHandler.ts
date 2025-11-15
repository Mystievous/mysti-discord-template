import { Events, Interaction, MessageFlags } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { ClientExtended } from "scripts/ClientExtended";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client: ClientExtended, interaction: Interaction) {
    if (!interaction.isContextMenuCommand()) return;

    const command = client.contextMenuCommands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(client, interaction as any);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
});
