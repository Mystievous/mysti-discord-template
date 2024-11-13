import {
  UserSelectConfig,
} from "app/scripts/ComponentConfig";
import {
  UserSelectMenuBuilder,
} from "discord.js";

const id = "userselect";

export default new UserSelectConfig(
  id,
  new UserSelectMenuBuilder(),
  async (client, interaction) => {
    const selected = interaction.values[0];
    interaction.reply({
      content: `Selected: ${selected}`,
      ephemeral: true,
    });
  }
);
