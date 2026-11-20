import { SlashCommandBuilder } from "discord.js";

import { UnexpectedResponseError } from "app/scripts/api/errors";
import { createEntry } from "app/scripts/api/generated/endpoints/entries";
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
    const name = interaction.options.getString("name", true);
    const response = await createEntry({ name });

    switch (response.status) {
      case 200:
        await interaction.editReply(
          `"${response.data.name}" (${response.data.id}) inserted into the database.`,
        );
        break;
      case 409:
        await interaction.editReply(
          `An entry with that name already exists in the database.`,
        );
        break;
      // These are not expected from this command. Re-throw up to the command handler.
      case 400:
      case 401:
      case 403:
      case 422:
        throw new UnexpectedResponseError("createEntry", response);
    }
  },
});
