import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";
import { promptModal } from "app/scripts/promptModal";
import {
  ContainerBuilder,
  FileUploadBuilder,
  LabelBuilder,
  MediaGalleryBuilder,
  MessageFlags,
  ModalBuilder,
  RadioGroupBuilder,
  RadioGroupOptionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

// Field custom IDs, shared by builders and submit handling below
const FIELDS = {
  title: "title",
  description: "description",
  color: "color",
  screenshot: "screenshot",
} as const;

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Example command that opens a modal form"),
  async execute(_client, interaction) {
    // Built inline, so pre-filled values can come straight from here, unlike
    // components which use our custom data system for that
    const modal = new ModalBuilder()
      .setTitle("Example Modal")
      .addLabelComponents(
        new LabelBuilder()
          .setLabel("Title")
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId(FIELDS.title)
              .setStyle(TextInputStyle.Short)
              .setValue("This is a modal!")
              .setMaxLength(100),
          ),
        new LabelBuilder()
          .setLabel("Description")
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId(FIELDS.description)
              .setStyle(TextInputStyle.Paragraph)
              .setValue(
                "You can make changes, just like any form on a website!\nThis is how you can get free text input from a user.",
              ),
          ),
        new LabelBuilder()
          .setLabel("Color")
          .setRadioGroupComponent(
            new RadioGroupBuilder()
              .setCustomId(FIELDS.color)
              .addOptions(
                new RadioGroupOptionBuilder()
                  .setLabel("Orange")
                  .setValue("0xfc8a3d")
                  .setDefault(true),
                new RadioGroupOptionBuilder()
                  .setLabel("Magenta")
                  .setValue("0xc74ebd"),
              ),
          ),
        new LabelBuilder()
          .setLabel("Screenshot")
          .setDescription("Optional image to display")
          .setFileUploadComponent(
            new FileUploadBuilder()
              .setCustomId(FIELDS.screenshot)
              .setRequired(false)
              .setMaxValues(1)
              .setFileTypes("image"),
          ),
      );

    // showModal must be the first response, so don't defer or reply before this.
    const submit = await promptModal(interaction, modal);
    if (!submit) return; // closed or timed out

    const title = submit.fields.getTextInputValue(FIELDS.title);
    const description = submit.fields.getTextInputValue(FIELDS.description);
    const color = submit.fields.getRadioGroup(FIELDS.color, true);
    const screenshot = submit.fields
      .getUploadedFiles(FIELDS.screenshot)
      ?.first();

    // Defer reply since uploading `files` in the response may take time
    await submit.deferReply({ flags: MessageFlags.Ephemeral });

    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ${title}`),
        new TextDisplayBuilder().setContent(description),
      )
      .setAccentColor(Number(color))
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
      );

    if (screenshot) {
      container
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("You attached this image:"),
        )
        .addMediaGalleryComponents(
          new MediaGalleryBuilder().addItems([
            {
              media: {
                url: `attachment://${screenshot.name}`,
              },
              description: screenshot.description,
              spoiler: screenshot.spoiler,
            },
          ]),
        );
    } else {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent("You didn't attach an image."),
      );
    }

    // Re-upload of the screenshot fails if the size is larger than the bot upload limit.
    // Guard file size if that matters.
    await submit.editReply({
      components: [container],
      files: screenshot ? [screenshot] : [],
      flags: MessageFlags.IsComponentsV2,
    });
  },
});
