import {
  ButtonConfig,
} from "app/scripts/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

export default new ButtonConfig(
  "accept",
  new ButtonBuilder()
    .setLabel("Accept")
    .setStyle(ButtonStyle.Primary),
  async (client, interaction) => {
    await interaction.reply({
      content: `Accepted, ${userMention(interaction.user.id)}`,
      ephemeral: true,
    });
  }
);
