import {
  ButtonConfig,
} from "app/scripts/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

export default new ButtonConfig(
  "button-with-data",
  new ButtonBuilder()
    .setLabel("Click to show data!")
    .setStyle(ButtonStyle.Success),
  async (client, interaction, data) => {
    await interaction.reply({
      content: `This button randomly generated: ${data}!`,
      ephemeral: true,
    });
  }
);
