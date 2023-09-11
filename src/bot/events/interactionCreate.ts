import { Events, Interaction } from "discord.js";
import { EventConfig } from "app/types/EventConfig";
import { ClientExtended } from "app/scripts/ClientExtended"

export default {
  name: Events.InteractionCreate,
  async execute(client: ClientExtended, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }, 
} as EventConfig;
