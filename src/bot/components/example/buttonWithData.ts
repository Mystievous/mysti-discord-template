import {
  ButtonConfig,
} from "app/scripts/ComponentConfig";
import {
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";

const id = "button-with-data";

export default new ButtonConfig(
  id,
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
