import { createEntry } from "app/scripts/api/generated/endpoints/entries";
import { isAxiosError } from "axios";
import { SlashCommandBuilder } from "discord.js";
import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";

export default makeSlashCommand({
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
      const newEntry = await createEntry({ name });
      await interaction.editReply(
        `"${newEntry.name}" (${newEntry.id}) inserted into the database.`
      );
    } catch (e: any) {
      if (isAxiosError(e) && e.status === 409) {
        await interaction.editReply(
          "An entry with that name already exists in the database."
        );
        return;
      }
      console.error(e);
      await interaction.editReply(`Error: ${e.message}`);
    }
  },
});
