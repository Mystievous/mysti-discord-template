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
        .setRequired(true),
    ),
  async execute(_client, interaction) {
    await interaction.deferReply();
    try {
      const name = interaction.options.getString("name", true);
      const newEntry = await createEntry({ name });
      await interaction.editReply(
        `"${newEntry.name}" (${newEntry.id}) inserted into the database.`,
      );
    } catch (e: unknown) {
      // Expected error 409. If the name is taken, an error is thrown and we handle it here.
      // Anything else gets re-thrown to go back to the command handler's catch.
      if (isAxiosError(e) && e.response?.status === 409) {
        await interaction.editReply(
          "An entry with that name already exists in the database.",
        );
        return;
      }
      throw e;
    }
  },
});
