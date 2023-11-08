import { Events, Interaction } from "discord.js";
import { EventConfig } from "types/configs/EventConfig";
import { ClientExtended } from "scripts/ClientExtended"

export default {
  name: Events.InteractionCreate,
  async execute(client: ClientExtended, interaction: Interaction) {
    if (!interaction.isMessageComponent()) return;

    const type = interaction.componentType;
    const id = interaction.customId;
    const component = client.components.get(type)?.get(id);

    if (component === undefined) {
      console.error(
        `No component matching ${id} was found.`
      );
      return;
    }

    try {
      if (component.execute !== undefined) {
        await component.execute(client, interaction);
      }
    } catch (error) {
      console.error(error);
    }

  }, 
} as EventConfig;
