import { ClientEvents } from "discord.js";

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  priority?: number;
  execute: (...args: ClientEvents[K]) => void | Promise<void>;
}
