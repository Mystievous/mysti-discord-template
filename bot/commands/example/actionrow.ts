import accept from "app/components/example/accept";
import buttonWithData from "app/components/example/buttonWithData";
import decline from "app/components/example/decline";
import stringselect from "app/components/example/stringselect";
import userselect from "app/components/example/userselect";
import { randomUUID } from "crypto";
import {
  ActionRowBuilder,
  ButtonBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  UserSelectMenuBuilder,
} from "discord.js";
import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("actionrow")
    .setDescription(
      "Example Command with actionrows for the template repository."
    ),
  async execute(client, interaction) {
    const buttonLabel = new TextDisplayBuilder().setContent("Buttons:");

    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      accept.getBuilder(),
      decline.getBuilder(),
      buttonWithData.getBuilder(randomUUID())
    );

    const separator = new SeparatorBuilder().setSpacing(
      SeparatorSpacingSize.Large
    );

    const selectLabel = new TextDisplayBuilder().setContent("Select:");

    const stringSelectRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        stringselect.getBuilder()
      );
    const userSelectRow =
      new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
        userselect.getBuilder()
      );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [
        buttonLabel,
        buttonRow,
        separator,
        selectLabel,
        stringSelectRow,
        userSelectRow,
      ],
    });
  },
});
