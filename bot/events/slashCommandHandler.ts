import { Events } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { resolveSubcommand } from "app/scripts/bot_structures/CommandConfig";
import { universalRespond } from "app/scripts/universalRespond";
import { UserMessages } from "app/scripts/messages";
import { activeInteraction } from "app/scripts/activeInteraction";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const subcommandGroup = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand(false);
    const label = [interaction.commandName, subcommandGroup, subcommand]
      .filter(Boolean)
      .join(" ");

    const command = client.slashCommands.get(interaction.commandName);
    const target =
      command?.type === "subcommand"
        ? resolveSubcommand(command, subcommandGroup, subcommand)
        : command;

    if (!target) {
      console.error(`[command /${label}] No handler registered.`);
      await universalRespond(interaction, UserMessages.unavailable);
      return;
    }

    const context = { current: interaction };
    try {
      await activeInteraction.run(context, () =>
        target.execute(client, interaction),
      );
    } catch (error) {
      console.error(`[command /${label}] Execution failed:`, error);
      await universalRespond(context.current, UserMessages.failed);
    }
  },
});
