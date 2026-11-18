import { MessageFlags, type RepliableInteraction } from "discord.js";

// Responds to an interaction with whatever state it's in
export async function universalRespond(
  interaction: RepliableInteraction,
  message: string,
) {
  // deferUpdate() leaves ephemeral null, which means there's no reply to edit.
  // This could change with discord.js updates.
  const deferredUpdate = interaction.deferred && interaction.ephemeral === null;

  if (interaction.replied || deferredUpdate) {
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
