import { ContextMenuCommandBuilder } from "discord.js";

import { makeMessageContextMenuCommand } from "app/scripts/bot_structures/CommandConfig";

export default makeMessageContextMenuCommand({
  data: new ContextMenuCommandBuilder().setName("message-context-menu-command"),
  async execute(_client, interaction) {
    await interaction.reply(
      `Message contains: ${interaction.targetMessage.content}`,
    );
  },
});
