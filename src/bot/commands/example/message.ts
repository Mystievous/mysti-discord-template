import { addEntry } from "app/scripts/Database";
import { SlashCommandBuilder, userMention } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription(
      "Example Command for the template repository."
    ),
  async execute(client, interaction) {
    return interaction.reply(
    `Hello, ${userMention(interaction.user.id)}`
    );
  },
} as CommandConfig;
