import accept from "app/components/example/accept";
import buttonWithData from "app/components/example/buttonWithData";
import decline from "app/components/example/decline";
import stringselect from "app/components/example/stringselect";
import userselect from "app/components/example/userselect";
import { randomUUID } from "crypto";
import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, userMention } from "discord.js";
import { CommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("actionrow")
    .setDescription(
      "Example Command with actionrows for the template repository."
    ),
  async execute(client, interaction) {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(accept.getBuilder(), decline.getBuilder(), buttonWithData.getBuilder(randomUUID()));
    const stringSelectRow = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(stringselect.getBuilder());
    const userSelectRow = new ActionRowBuilder<UserSelectMenuBuilder>()
      .addComponents(userselect.getBuilder());
    

    interaction.reply(
      {
        content: `Actionrows`,
        components: [buttonRow, stringSelectRow, userSelectRow]
      }
    );
  },
} as CommandConfig;
