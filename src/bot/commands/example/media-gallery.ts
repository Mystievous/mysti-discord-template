import {
  MediaGalleryBuilder,
  MessageFlags,
  SlashCommandBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { SlashCommandConfig } from "types/configs/CommandConfig";

export default {
  data: new SlashCommandBuilder()
    .setName("media-gallery")
    .setDescription(
      "Example Command with a media gallery for the template repository."
    ),
  async execute(client, interaction) {

    // Button Section
    const textComponent = new TextDisplayBuilder().setContent(
      "This message contains a media gallery."
    );

    const mediaGallery = new MediaGalleryBuilder().addItems([
      {
        media: {
          url: "https://avatars.githubusercontent.com/u/24994640?v=4",
        },
      },
      {
        media: {
          url: "https://avatars.githubusercontent.com/u/114467338?v=4",
        },
      },
      {
        media: {
          url: "https://avatars.githubusercontent.com/u/172342444?s=400&u=e678f633a9fd14ac199bc36ae7a530e27544ce39&v=4",
        },
        description: "The StarSeek Studios Logo.",
        spoiler: true
      },
    ]);

    // Reply with the sections      
    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [
        mediaGallery,
        textComponent,
      ],
    });
  },
} as SlashCommandConfig;
