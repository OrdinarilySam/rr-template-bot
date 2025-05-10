import "dotenv/config";
import { Client, Collection, Events, IntentsBitField } from "discord.js";
import {
  getCommands,
  loadCommands,
  registerCommands,
} from "./register-commands";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Command } from "./types/Command";

const client: Client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.commands = new Collection<string, Command>();

client.on(Events.ClientReady, (c) => {
  console.log(`${c.user.username} is online!`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;

  console.log(message.content);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No matching command found for ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error in command ${interaction.commandName}`, error);
    await interaction.reply({
      content: "There was an error executing this command.",
      ephemeral: true,
    });
  }
});

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const commandsPath = join(__dirname, "commands");

  const commands = await getCommands(commandsPath);
  await registerCommands(commands);
  await loadCommands(client, commands);
  await client.login(process.env.DISCORD_TOKEN);
})();
