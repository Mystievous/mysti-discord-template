import { ButtonConfig, ComponentConfig, StringSelectConfig, UserSelectConfig } from "app/types/configs/components/ComponentConfig";
import { ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, userMention } from "discord.js";

const id = "userselect";

export default {
  type: ComponentType.UserSelect,
  id,
  builder: new UserSelectMenuBuilder()
    .setCustomId(id),
  async execute(client, interaction) {
    const selected = interaction.values[0];
    interaction.reply(
      {
        content: `Selected: ${selected}`,
        ephemeral: true
      }
    );
  }
} as UserSelectConfig