import { Client } from "discord.js";
import { Event } from "../types/Event";
import { getFiles } from "./getFiles";

export async function getEvents(path: string) {
  const files = await getFiles(path);
  const events: Event[] = [];

  files.forEach(async (file) => {
    const { default: event }: { default: Event } = await import(file);
    events.push(event);
  });

  return events;
}

export async function registerEvents(client: Client, events: Event[]) {
  events.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
}
