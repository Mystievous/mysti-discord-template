import { addEntry } from "app/scripts/Database";
import { SlashCommandBuilder, userMention } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";

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
    try {
        const name = (interaction.options as any).getString("name", true);
        await addEntry(client, { name: name });
        return await interaction.reply(
            `${name} inserted into the database.`
        )
    } catch (e: any) {
        return await interaction.reply(`Error: ${e.message}`)
    }
  },
} as CommandConfig;
