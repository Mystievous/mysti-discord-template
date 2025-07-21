import { Events, Interaction } from "discord.js";
import { EventConfig } from "types/configs/EventConfig";
import { ClientExtended } from "scripts/ClientExtended";
import { separateData } from "app/scripts/ComponentConfig";

export default {
  name: Events.InteractionCreate,
  execute(client: ClientExtended, interaction: Interaction) {
    if (!interaction.isMessageComponent()) return;

    const type = interaction.componentType;
    const identifier = separateData(interaction.customId);
    const component = client.components.get(type)?.get(identifier.id);

    if (component === undefined) {
      console.error(`No component matching ${identifier} was found.`);
      return;
    }

    try {
      if (component.execute !== undefined) {
        component.execute(client, interaction, identifier.data);
      }
    } catch (error) {
      console.error(error);
    }
  },
} as EventConfig;
