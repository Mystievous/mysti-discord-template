import { SlashCommandBuilder } from "discord.js";
import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";
import { counterMessage } from "app/components/example/counterButton";

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("counter")
    .setDescription(
      "Example command for coalescing message refreshes/async actions.",
    ),
  async execute(_client, interaction) {
    await interaction.reply(counterMessage({ clicks: 0, refreshes: 0 }));
  },
});
