import {
  ButtonConfig,
} from "app/scripts/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

export default new ButtonConfig(
  "decline",
  new ButtonBuilder()
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger),
  async (client, interaction) => {
    await interaction.reply({
      content: `Declined, ${userMention(interaction.user.id)}`,
      ephemeral: true,
    });
  }
);
