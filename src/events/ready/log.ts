import { Events } from "discord.js";
import { Event } from "../../types/Event";

const logReady: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`${client.user.username} is online!`);
  },
};

export default logReady;
