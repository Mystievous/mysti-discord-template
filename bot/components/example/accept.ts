import { makeButton } from "app/scripts/bot_structures/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  userMention,
} from "discord.js";

export default makeButton({
  id: "accept",
  createBuilder: () =>
    new ButtonBuilder().setLabel("Accept").setStyle(ButtonStyle.Primary),
  async execute(_client, interaction) {
    await interaction.reply({
      content: `Accepted, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
