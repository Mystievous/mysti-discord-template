import { ClientExtended } from "app/scripts/ClientExtended"; 

export interface EventConfig {
  name: string;
  once?: boolean;
  execute: (client: ClientExtended, ...args: any[]) => void;
}