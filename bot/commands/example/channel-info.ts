import { makeSlashCommand } from "app/scripts/bot_structures/CommandConfig";
import { fetchChannelOrNull, InteractionWithGuild } from "app/scripts/utils";
import {
  channelMention,
  ChannelType,
  Client,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  Snowflake,
} from "discord.js";

// IDs normally would come from the database. We're using a channel option
// to show off the command, but the channel ID can come from anywhere.
async function describeChannel(
  client: Client,
  interaction: InteractionWithGuild,
  id: Snowflake,
): Promise<string> {
  const channel = await fetchChannelOrNull(client, id);
  if (!channel) return "That channel doesn't exist, or the bot cannot see it.";
  if (channel.isDMBased() || channel.guildId !== interaction.guildId)
    return "That channel is in a different server.";
  return `That channel is: ${channelMention(channel.id)} (${ChannelType[channel.type]}).`;
}

export default makeSlashCommand({
  data: new SlashCommandBuilder()
    .setName("channel-info")
    .setDescription("Example command for fetching channel info.")
    .setContexts(InteractionContextType.Guild)
    .addChannelOption((builder) =>
      builder
        .setName("channel")
        .setDescription("The channel to query.")
        .setRequired(true),
    ),
  async execute(client, interaction) {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "This must be run from a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const { id: channelId } = interaction.options.getChannel("channel", true);

    const describe = await describeChannel(client, interaction, channelId);

    await interaction.editReply({ content: describe });
  },
});
