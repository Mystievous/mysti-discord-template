import { Events } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { resolveSubcommand } from "app/scripts/bot_structures/CommandConfig";
import { universalRespond } from "app/scripts/universalRespond";
import { UserMessages } from "app/scripts/messages";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      console.error(
        `[command /${interaction.commandName}] No handler registered.`,
      );
      await universalRespond(interaction, UserMessages.unavailable);
      return;
    }

    try {
      if (command.type === "subcommand") {
        const subcommand = resolveSubcommand(
          command,
          interaction.options.getSubcommandGroup(false),
          interaction.options.getSubcommand(),
        );
        if (!subcommand) {
          console.error(
            `[command /${interaction.commandName}] Unknown subcommand.`,
          );
          await universalRespond(interaction, UserMessages.unavailable);
          return;
        }
        await subcommand.execute(client, interaction);
      } else {
        await command.execute(client, interaction);
      }
    } catch (error) {
      console.error(
        `[command /${interaction.commandName}] Execution failed:`,
        error,
      );
      await universalRespond(interaction, UserMessages.failed);
    }
  },
});
