import { ClientExtended } from "scripts/ClientExtended"; 

export interface EventConfig {
  name: string;
  once?: boolean;
  execute: (client: ClientExtended, ...args: any[]) => void;
}