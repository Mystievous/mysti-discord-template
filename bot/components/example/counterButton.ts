import { setTimeout } from "node:timers/promises";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  Snowflake,
} from "discord.js";

import { makeButton } from "app/scripts/bot_structures/ComponentConfig";
import { createCoalescer } from "app/scripts/coalesce";

type Count = {
  clicks: number;
  refreshes: number;
};

// In bot memory, resets when bot restarts.
const counts = new Map<Snowflake, Count>();
const refreshCounter = createCoalescer<Snowflake, void>();

export function counterMessage(
  count: Count,
): InteractionReplyOptions & InteractionEditReplyOptions {
  return {
    content: `Clicks: ${count.clicks}\nRefreshes: ${count.refreshes}\n-# Spam the button. Only one refresh runs at a time, so extra clicks share the next one.`,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        counterButton.getBuilder(),
      ),
    ],
  };
}

const counterButton = makeButton({
  id: "counter",
  createBuilder: () =>
    new ButtonBuilder().setLabel("Click!").setStyle(ButtonStyle.Primary),
  async execute(_client, interaction) {
    await interaction.deferUpdate();

    const id = interaction.message.id;
    const count = counts.get(id) ?? { clicks: 0, refreshes: 0 };
    count.clicks++;
    counts.set(id, count);

    await refreshCounter(id, async () => {
      // Stand-in for slow work, like API calls or editing a bunch of messages
      await setTimeout(2000);
      count.refreshes++;
      await interaction.editReply(counterMessage(count));
    });
  },
});

export default counterButton;
