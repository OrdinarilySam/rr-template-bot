import "dotenv/config";
import { Client, Collection, IntentsBitField } from "discord.js";
import {
  getCommands,
  loadCommands,
  registerCommands,
} from "./utils/commandsUtils";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Command } from "./types/Command";
import { getEvents, registerEvents } from "./utils/eventsUtils";

const client: Client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.commands = new Collection<string, Command>();

async function setupCommands(rootDir: string) {
  const commandsPath = join(rootDir, "commands");
  const commands = await getCommands(commandsPath);
  await registerCommands(commands);
  await loadCommands(client, commands);
}

async function setupEvents(rootDir: string) {
  const eventsPath = join(rootDir, "events");
  const events = await getEvents(eventsPath);
  await registerEvents(client, events);
}

// client.on(Events.MessageCreate, (message) => {
//   if (message.author.bot) return;

//   console.log(message.content);
// });

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  await setupCommands(__dirname);
  await setupEvents(__dirname);

  await client.login(process.env.DISCORD_TOKEN);
})();
