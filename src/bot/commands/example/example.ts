import { SlashCommandBuilder, userMention } from "discord.js";
import { CommandConfig } from "app/types/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("example")
    .setDescription(
      "Example Command for the template repository."
    ),
  async execute(client, interaction) {
    return interaction.reply(
    `Hello, ${userMention(interaction.user.id)}`
    );
  },
} as CommandConfig;
