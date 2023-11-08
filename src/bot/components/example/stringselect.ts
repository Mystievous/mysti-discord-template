import { ButtonConfig, ComponentConfig, StringSelectConfig } from "app/types/configs/components/ComponentConfig";
import { ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, userMention } from "discord.js";

const id = "stringselect";

export default {
  type: ComponentType.StringSelect,
  id,
  builder: new StringSelectMenuBuilder()
    .setCustomId(id)
    .addOptions([
        new StringSelectMenuOptionBuilder({
            label: "Option 1",
            value: "option1"
        }),
        new StringSelectMenuOptionBuilder({
            label: "Option 2",
            value: "option2"
        }),
        new StringSelectMenuOptionBuilder({
            label: "Option 3",
            value: "option3"
        })
    ]),
  async execute(client, interaction) {
    const selected = interaction.values[0];
    interaction.reply(
      {
        content: `Selected: ${selected}`,
        ephemeral: true
      }
    );
  }
} as StringSelectConfig