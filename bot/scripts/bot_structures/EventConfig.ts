import type { Awaitable, ClientEvents } from "discord.js";
import { ClientExtended } from "scripts/ClientExtended";

export interface EventConfig<
  EventName extends keyof ClientEvents = keyof ClientEvents,
> {
  name: EventName;
  once?: boolean;
  execute: (
    client: ClientExtended,
    ...args: ClientEvents[EventName]
  ) => Awaitable<void>;
}

export function makeEvent<EventName extends keyof ClientEvents>(
  config: EventConfig<EventName>,
): EventConfig<EventName> {
  return config;
}

// Runtime check for an event file's export
export function isEventConfig(value: unknown): value is EventConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "execute" in value &&
    typeof value.execute === "function"
  );
}
