import { AsyncLocalStorage } from "async_hooks";
import { RepliableInteraction } from "discord.js";

// The interaction that errors get reported to. promptModal swaps it to the submit,
// since the original can't be responded to after showing a modal.
export const activeInteraction = new AsyncLocalStorage<{
  current: RepliableInteraction;
}>();
