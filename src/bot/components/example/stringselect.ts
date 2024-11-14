import { StringSelectConfig } from "app/scripts/ComponentConfig";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export default new StringSelectConfig(
  "stringselect",
  new StringSelectMenuBuilder().addOptions([
    new StringSelectMenuOptionBuilder({
      label: "Option 1",
      value: "option1",
    }),
    new StringSelectMenuOptionBuilder({
      label: "Option 2",
      value: "option2",
    }),
    new StringSelectMenuOptionBuilder({
      label: "Option 3",
      value: "option3",
    }),
  ]),
  async (client, interaction) => {
    const selected = interaction.values[0];
    interaction.reply({
      content: `Selected: ${selected}`,
      ephemeral: true,
    });
  }
);
