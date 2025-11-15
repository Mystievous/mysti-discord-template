import type { ClientEvents, Events } from "discord.js";
import { ClientExtended } from "scripts/ClientExtended";

export interface EventConfig {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (client: ClientExtended, ...args: any[]) => void;
}

export function makeEvent(config: EventConfig) {
  return config;
}
