import { SlashCommandBuilder, userMention } from "discord.js";
import { SlashCommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Example Command for the template repository."),
  async execute(client, interaction) {
    return await interaction.reply(
      `Hello, ${userMention(interaction.user.id)}`
    );
  },
} as SlashCommandConfig;
