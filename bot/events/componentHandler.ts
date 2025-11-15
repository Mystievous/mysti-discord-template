import { Events, Interaction } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { ClientExtended } from "scripts/ClientExtended";
import { separateData } from "app/scripts/bot_structures/ComponentConfig";

export default makeEvent({
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
});
