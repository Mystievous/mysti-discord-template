import { Events, Interaction, MessageFlags } from "discord.js";
import { makeEvent } from "app/scripts/bot_structures/EventConfig";
import { ClientExtended } from "scripts/ClientExtended";
import type {
  SubcommandGroup,
  SubcommandsCommandConfig,
} from "app/scripts/bot_structures/CommandConfig";

export default makeEvent({
  name: Events.InteractionCreate,
  async execute(client: ClientExtended, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      interaction.reply({
        content: "That command could not be found.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (command.type === "subcommand") {
      try {
        let commandToRun: SubcommandsCommandConfig | SubcommandGroup = command;
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        if (subcommandGroup) {
          const groupConfig = command.subcommands[subcommandGroup];
          if (groupConfig.type !== "group") {
            console.error(
              `Subcommand group ${subcommandGroup} is not a group.`
            );
            return;
          }
          commandToRun = groupConfig;
        }

        const subcommand = interaction.options.getSubcommand(false);
        if (subcommand) {
          const subcommandConfig = commandToRun.subcommands[subcommand];
          if (subcommandConfig.type !== "command") {
            console.error(`Subcommand ${subcommand} is not a command.`);
            return;
          }
          await subcommandConfig.execute(client, interaction);
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this subcommand!",
          flags: MessageFlags.Ephemeral,
        });
      }
    } else {
      try {
        await command.execute(client, interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
});
