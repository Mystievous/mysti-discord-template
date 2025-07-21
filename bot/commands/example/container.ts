import accept from "app/components/example/accept";
import buttonWithData from "app/components/example/buttonWithData";
import decline from "app/components/example/decline";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ContainerBuilder, FileBuilder, FileComponent, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, SlashCommandBuilder, TextDisplayBuilder, userMention } from "discord.js";
import { Readable } from "stream";
import { SlashCommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("container")
    .setDescription("Example command with a container for the template repository."),
  async execute(client, interaction) {
    // Containers are what used to be called "embeds" in the Discord API.
    
    const textComponent = new TextDisplayBuilder()
      .setContent("## This is a container!")

    const textComponent2 = new TextDisplayBuilder()
      .setContent("It can do stuff!")

    const sectionComponent = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("This is a section inside a container.")
      )
      .setButtonAccessory(buttonWithData.getBuilder())

    const actionRowComponent = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        accept.getBuilder(),
        decline.getBuilder()
      )

    const attachment = new AttachmentBuilder(Readable.from("Woah it's a text file!"), {
      name: "example.txt",
      description: "An example text file for the discord bot template.",
    })

    const fileComponent = new FileBuilder().setURL("attachment://example.txt");

    const containerComponent = new ContainerBuilder()
      .addTextDisplayComponents(textComponent, textComponent2)
      .addActionRowComponents(actionRowComponent)
      .addSectionComponents(sectionComponent)
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("-# You can even add more text components!"),
        new TextDisplayBuilder().setContent("### ~~And use formatting!~~")
      )
      .addFileComponents(
        fileComponent
      )
      .setAccentColor(0x00ff00);
    
    return await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [
        containerComponent,
      ],
      files: [
        attachment
      ]
    });
  },
} as SlashCommandConfig;
