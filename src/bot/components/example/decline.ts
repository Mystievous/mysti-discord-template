import { ButtonConfig, ComponentConfig } from "app/types/configs/components/ComponentConfig";
import { ButtonBuilder, ButtonStyle, ComponentType, userMention } from "discord.js";

const id = "decline";

export default {
  type: ComponentType.Button,
  id,
  builder: new ButtonBuilder()
    .setCustomId(id)
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger),
  async execute(client, interaction) {
    interaction.reply(
      {
        content: `Declined, ${userMention(interaction.user.id)}`,
        ephemeral: true
      }
    );
  }
} as ButtonConfig