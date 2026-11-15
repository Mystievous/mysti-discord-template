import { makeMessageContextMenuCommand } from "app/scripts/bot_structures/CommandConfig";
import { ContextMenuCommandBuilder } from "discord.js";

export default makeMessageContextMenuCommand({
  data: new ContextMenuCommandBuilder().setName("message-context-menu-command"),
  async execute(_client, interaction) {
    await interaction.reply(
      `Message contains: ${interaction.targetMessage.content}`,
    );
  },
});
