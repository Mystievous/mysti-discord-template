import { MessageFlags, type RepliableInteraction } from "discord.js";

// Responds to an interaction with whatever state it's in
export async function universalRespond(
  interaction: RepliableInteraction,
  message: string,
) {
  if (interaction.replied) {
    await interaction.followUp({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  } else if (interaction.deferred) {
    await interaction.editReply(message);
  } else {
    await interaction.reply({
      content: message,
      flags: MessageFlags.Ephemeral,
    });
  }
}
