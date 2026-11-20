import { Events } from "discord.js";

import { activeInteraction } from "app/scripts/activeInteraction";
import { separateData } from "app/scripts/bot_structures/ComponentConfig";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { UserMessages } from "app/scripts/messages";
import { universalRespond } from "app/scripts/universalRespond";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isMessageComponent()) return;

    const type = interaction.componentType;
    const identifier = separateData(interaction.customId);
    const component = client.components.get(type)?.get(identifier.id);

    if (component === undefined) {
      console.error(`[component ${identifier.id}] No handler registered.`);
      await universalRespond(interaction, UserMessages.unavailable);
      return;
    }

    const context = { current: interaction };
    try {
      await activeInteraction.run(context, () =>
        component.execute(client, interaction, identifier.data),
      );
    } catch (error) {
      console.error(`[component ${identifier.id}] Execution failed:`, error);
      await universalRespond(context.current, UserMessages.failed);
    }
  },
});
