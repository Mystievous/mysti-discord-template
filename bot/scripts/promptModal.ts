import {
  CommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
  MessageComponentInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
} from "discord.js";

import { activeInteraction } from "app/scripts/activeInteraction";
import { addData } from "app/scripts/bot_structures/ComponentConfig";

/**
 * Shows a modal and waits for the user to submit it.
 *
 * Returns `null` if they close it or don't submit within `timeMs`.
 * Discord sends nothing when a modal is closed, so the timeout is the only signal.
 *
 * Build the modal inline where it's needed, so pre-filled values can come
 * from the surrounding context.
 *
 * The modal's custom ID is set here, so doesn't need to be set manually.
 */
export async function promptModal(
  interaction: CommandInteraction | MessageComponentInteraction,
  modal: ModalBuilder,
  timeMs = 15 * 60 * 1000,
): Promise<ModalSubmitInteraction | null> {
  // Unique per call, so they never overlap
  const customId = addData("prompt-modal", interaction.id);
  modal.setCustomId(customId);

  await interaction.showModal(modal);

  try {
    const submit = await interaction.awaitModalSubmit({
      time: timeMs,
      filter: (submit) =>
        submit.customId === customId && submit.user.id === interaction.user.id,
    });
    const store = activeInteraction.getStore();
    if (store) store.current = submit;
    return submit;
  } catch (error) {
    if (
      error instanceof DiscordjsError &&
      error.code === DiscordjsErrorCodes.InteractionCollectorError
    ) {
      // Modal closed or timed out
      return null;
    }
    throw error;
  }
}
