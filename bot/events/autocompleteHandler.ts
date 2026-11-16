import { resolveSubcommand } from "app/scripts/bot_structures/CommandConfig";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { Events } from "discord.js";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isAutocomplete()) return;

    const command = client.slashCommands.get(interaction.commandName);
    const handler =
      command?.type === "subcommand"
        ? resolveSubcommand(
            command,
            interaction.options.getSubcommandGroup(false),
            interaction.options.getSubcommand(),
          )?.autocomplete
        : command?.autocomplete;

    try {
      if (!handler) {
        console.error(
          `[autocomplete /${interaction.commandName}] No autocomplete handler registered.`,
        );
        await interaction.respond([]);
        return;
      }
      await handler(client, interaction);
    } catch (error) {
      console.error(
        `[autocomplete /${interaction.commandName}] Failed:`,
        error,
      );
      // Autocomplete can't show error messages, so fallback to empty response
      if (!interaction.responded) await interaction.respond([]);
    }
  },
});
