import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";

import { makeButton } from "app/scripts/bot_structures/ComponentConfig";

export default makeButton({
  id: "button-with-data",
  createBuilder: () =>
    new ButtonBuilder()
      .setLabel("Click to show data!")
      .setStyle(ButtonStyle.Success),
  async execute(_client, interaction, data) {
    await interaction.reply({
      content: `This button randomly generated: ${data}!`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
