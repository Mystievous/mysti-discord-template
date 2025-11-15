import { makeContextMenuCommand } from "app/scripts/bot_structures/CommandConfig";
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  userMention,
  MessageContextMenuCommandInteraction,
} from "discord.js";

export default makeContextMenuCommand({
  data: new ContextMenuCommandBuilder()
    .setName("message-context-menu-command")
    .setType(ApplicationCommandType.Message),
  async execute(client, interaction) {
    if (!interaction.isMessageContextMenuCommand()) return;
    await interaction.reply(
      `Message contains: ${interaction.targetMessage.content}`
    );
  },
});
