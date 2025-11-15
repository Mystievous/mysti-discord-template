import { SlashCommandBuilder, userMention } from "discord.js";
import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Example Command for the template repository."),
  async execute(client, interaction) {
    await interaction.reply(`Hello, ${userMention(interaction.user.id)}`);
  },
});
