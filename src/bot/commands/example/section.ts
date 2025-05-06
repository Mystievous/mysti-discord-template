import sectionButton from "app/components/example/sectionButton";
import {
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SlashCommandBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import { SlashCommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("section")
    .setDescription(
      "Example Command with a 'section' for the template repository."
    ),
  async execute(client, interaction) {

    // Button Section
    const textComponent = new TextDisplayBuilder().setContent(
      "## This is a section."
    );
    const textComponent2 = new TextDisplayBuilder().setContent(
      "It can have a maximum of 3 text components."
    );
    const textComponent3 = new TextDisplayBuilder().setContent(
      "And optionally a button or thumbnail 'accessory'."
    );

    const button = sectionButton.getBuilder();

    const buttonSection = new SectionBuilder()
      .addTextDisplayComponents(textComponent, textComponent2, textComponent3)
      .setButtonAccessory(button);


    // Thumbnail Section
    const imageText = new TextDisplayBuilder().setContent(
      "## This is a section with an image."
    );
    const imageText2 = new TextDisplayBuilder().setContent(
      "And only 2 text components."
    );

    const thumbnailComponent = new ThumbnailBuilder({
      media: {
        url: "https://avatars.githubusercontent.com/u/172342444?s=400&u=e678f633a9fd14ac199bc36ae7a530e27544ce39&v=4"
      },
      description: "The StarSeek Studios Logo.",
    })
    
    const imageSection = new SectionBuilder()
      .addTextDisplayComponents(imageText, imageText2)
      .setThumbnailAccessory(thumbnailComponent);


    // Reply with the sections      
    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [
        new SeparatorBuilder().setSpacing(2).setDivider(false),
        buttonSection,
        new SeparatorBuilder().setSpacing(2).setDivider(false),
        imageSection,
      ],
    });
  },
} as SlashCommandConfig;
