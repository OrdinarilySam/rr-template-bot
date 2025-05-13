import { Client, REST, Routes } from "discord.js";
import "dotenv/config";
import type { Command } from "../types/Command";
import { getFiles } from "./getFiles";

export async function getCommands(path: string): Promise<Command[]> {
  const files = await getFiles(path);
  const commands: Command[] = [];

  files.forEach(async (file) => {
    const { default: command }: { default: Command } = await import(file);
    commands.push(command);
  });

  return commands;
}

export async function registerCommands(commands: Command[]) {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

export async function loadCommands(client: Client, commands: Command[]) {
  commands.forEach((cmd) => {
    client.commands.set(cmd.data.name, cmd);
  });
}
