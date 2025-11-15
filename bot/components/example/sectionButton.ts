import {
  ButtonConfig,
} from "app/scripts/bot_structures/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  userMention,
} from "discord.js";

export default new ButtonConfig(
  "section",
  new ButtonBuilder()
    .setLabel("Section Button")
    .setStyle(ButtonStyle.Primary),
  async (client, interaction) => {
    await interaction.reply({
      content: `You clicked the section button, ${userMention(interaction.user.id)}`,
      flags: MessageFlags.Ephemeral
    });
  }
);
