import {
  Client,
  DiscordAPIError,
  RepliableInteraction,
  RESTJSONErrorCodes,
  Snowflake,
} from "discord.js";

// Discord.js errors if a channel doesn't exist or the bot can't see it, so this ensures you either get it or null.
export async function fetchChannelOrNull(client: Client, id: Snowflake) {
  try {
    return await client.channels.fetch(id);
  } catch (error) {
    if (
      error instanceof DiscordAPIError &&
      (error.code === RESTJSONErrorCodes.UnknownChannel ||
        error.code === RESTJSONErrorCodes.MissingAccess)
    ) {
      return null;
    }
    throw error;
  }
}

// Narrowed with interaction.inGuild(), so guildId is a string, not string | null
export type InteractionWithGuild = RepliableInteraction<"cached" | "raw">;
