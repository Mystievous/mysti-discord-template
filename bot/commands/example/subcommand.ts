import { SlashCommandBuilder, userMention } from "discord.js";
import { makeSubcommand } from "app/scripts/bot_structures/CommandConfig";

export default makeSubcommand({
  data: new SlashCommandBuilder()
    .setName("subcommand")
    .setDescription("Example Command for the template repository."),
  subcommands: {
    example: {
      type: "command",
      description: "Example subcommand",
      builder: (subcommand) => subcommand,
      async execute(client, interaction) {
        await interaction.reply(
          `This is an example subcommand, ${userMention(interaction.user.id)}!`
        );
      },
    },
    group: {
      type: "group",
      description: "Example subcommand group.",
      subcommands: {
        example: {
          type: "command",
          description: "Example command inside a group.",
          builder: (subcommand) => {
            return subcommand.addUserOption((option) =>
              option
                .setName("user")
                .setDescription("A user option.")
                .setRequired(true)
            );
          },
          async execute(client, interaction) {
            const user = interaction.options.getUser("user", true);
            await interaction.reply(
              `This is an example command inside a group with a command option, ${userMention(
                interaction.user.id
              )}! Selected user: *${user.displayName}*`
            );
          },
        },
        example2: {
          type: "command",
          description: "Another example command inside a group.",
          builder: (subcommand) => subcommand,
          async execute(client, interaction) {
            await interaction.reply(
              `This is another example command inside a group, ${userMention(
                interaction.user.id
              )}!`
            );
          },
        },
      },
    },
  },
});
