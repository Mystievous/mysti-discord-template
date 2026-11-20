import { MessageFlags, UserSelectMenuBuilder } from "discord.js";

import { makeUserSelect } from "app/scripts/bot_structures/ComponentConfig";

export default makeUserSelect({
  id: "userselect",
  createBuilder: () => new UserSelectMenuBuilder(),
  async execute(_client, interaction) {
    const selected = interaction.values[0];
    await interaction.reply({
      content: `Selected: ${selected}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
