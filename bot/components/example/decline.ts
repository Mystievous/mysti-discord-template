import {
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  userMention,
} from "discord.js";

import { makeButton } from "app/scripts/bot_structures/ComponentConfig";

export default makeButton({
  id: "decline",
  createBuilder: () =>
    new ButtonBuilder().setLabel("Decline").setStyle(ButtonStyle.Danger),
  async execute(_client, interaction) {
    await interaction.reply({
      content: `Declined, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
