import { Events } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import type {
  SubcommandGroup,
  SubcommandsCommandConfig,
} from "app/scripts/bot_structures/CommandConfig";
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
        let commandToRun: SubcommandsCommandConfig | SubcommandGroup = command;
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        if (subcommandGroup) {
          const groupConfig = command.subcommands[subcommandGroup];
          if (!groupConfig || groupConfig.type !== "group") {
            console.error(
              `[command /${interaction.commandName}] Unknown subcommand group "${subcommandGroup}".`,
            );
            await universalRespond(interaction, UserMessages.unavailable);
            return;
          }
          commandToRun = groupConfig;
        }

        const subcommand = interaction.options.getSubcommand(false);
        if (subcommand) {
          const subcommandConfig = commandToRun.subcommands[subcommand];
          if (!subcommandConfig || subcommandConfig.type !== "command") {
            console.error(
              `[command /${interaction.commandName}] Unknown subcommand "${subcommand}".`,
            );
            await universalRespond(interaction, UserMessages.unavailable);
            return;
          }
          await subcommandConfig.execute(client, interaction);
        }
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
