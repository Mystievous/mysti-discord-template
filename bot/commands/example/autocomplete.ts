import { SlashCommandBuilder } from "discord.js";

import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";

// Autocomplete options
const FRUITS = [
  "Apple",
  "Banana",
  "Mango",
  "Peach",
  "Blueberry",
  "Strawberry",
  "Watermelon",
  "Orange",
  "Lemon",
];

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("autocomplete")
    .setDescription("Example command to show string option autocomplete.")
    .addStringOption((option) =>
      option
        .setName("fruit")
        .setDescription("Start typing a fruit.")
        .setAutocomplete(true)
        .setRequired(true),
    ),
  async autocomplete(_client, interaction) {
    const typed = interaction.options.getFocused().toLowerCase();
    // Discord limits autocomplete results to 25 items
    const matches = FRUITS.filter((fruit) =>
      fruit.toLowerCase().includes(typed),
    ).slice(0, 25);

    await interaction.respond(
      matches.map((fruit) => ({ name: fruit, value: fruit })),
    );
  },
  async execute(_client, interaction) {
    const fruit = interaction.options.getString("fruit", true);
    // Suggestions aren't enforced, so users can submit any text.
    if (!FRUITS.includes(fruit)) {
      await interaction.reply(`"${fruit}" is not on the list.`);
      return;
    }
    await interaction.reply(`You picked ${fruit}.`);
  },
});
