import { ButtonConfig, ComponentConfig } from "app/types/configs/components/ComponentConfig";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, InteractionResponseType, StringSelectMenuBuilder, userMention } from "discord.js";

const id = "accept";

export default {
  type: ComponentType.Button,
  id,
  builder: new ButtonBuilder()
    .setCustomId(id)
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
  async execute(client, interaction) {
    await interaction.reply(
      {
        content: `Accepted, ${userMention(interaction.user.id)}`,
        ephemeral: true
      }
    );

  }
} as ButtonConfig