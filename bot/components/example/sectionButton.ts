import { makeButton } from "app/scripts/bot_structures/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  userMention,
} from "discord.js";

export default makeButton({
  id: "section",
  createBuilder: () =>
    new ButtonBuilder()
      .setLabel("Section Button")
      .setStyle(ButtonStyle.Primary),
  async execute(_client, interaction) {
    await interaction.reply({
      content: `You clicked the section button, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral,
    });
  },
});
