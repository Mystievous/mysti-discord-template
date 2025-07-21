import { ContextMenuCommandConfig } from "app/types/configs/CommandConfig";
import { ApplicationCommandType, ContextMenuCommandBuilder, userMention, MessageContextMenuCommandInteraction } from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("message-context-menu-command")
    .setType(ApplicationCommandType.Message),
  async execute(client, interaction) {
    if (!interaction.isMessageContextMenuCommand()) return;
    return await interaction.reply(
      `Message contains: ${interaction.targetMessage.content}`
    );
  },
} as ContextMenuCommandConfig;
