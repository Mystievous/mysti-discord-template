import {
  UserSelectConfig,
} from "app/scripts/bot_structures/ComponentConfig";
import {
  MessageFlags,
  UserSelectMenuBuilder,
} from "discord.js";

export default new UserSelectConfig(
  "userselect",
  new UserSelectMenuBuilder(),
  async (client, interaction) => {
    const selected = interaction.values[0];
    await interaction.reply({
      content: `Selected: ${selected}`,
      flags: MessageFlags.Ephemeral
    });
  }
);
