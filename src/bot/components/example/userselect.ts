import {
  UserSelectConfig,
} from "app/scripts/ComponentConfig";
import {
  UserSelectMenuBuilder,
} from "discord.js";

export default new UserSelectConfig(
  "userselect",
  new UserSelectMenuBuilder(),
  async (client, interaction) => {
    const selected = interaction.values[0];
    interaction.reply({
      content: `Selected: ${selected}`,
      ephemeral: true,
    });
  }
);
