import { addEntry } from "app/scripts/Database";
import { SlashCommandBuilder } from "discord.js";
import { SlashCommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("database")
    .setDescription("Example Command to write to the database.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name to write to the database.")
        .setMaxLength(45)
        .setRequired(true)
    ),
  async execute(client, interaction) {
    await interaction.deferReply();
    try {
      const name = (interaction.options as any).getString("name", true);
      await addEntry(client, { name: name });
      await interaction.editReply(`"${name}" inserted into the database.`);
    } catch (e: any) {
      console.error(e);
      await interaction.editReply(`Error: ${e.message}`);
    }
  },
} as SlashCommandConfig;
