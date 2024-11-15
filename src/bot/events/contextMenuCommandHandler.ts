import { Events, Interaction } from "discord.js";
import { EventConfig } from "types/configs/EventConfig";
import { ClientExtended } from "scripts/ClientExtended"

export default {
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
        ephemeral: true,
      });
    }
  }, 
} as EventConfig;
