import { Client, REST, Routes } from "discord.js";
import "dotenv/config";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import type { Command } from "./types/Command";

export async function getCommands(path: string): Promise<Command[]> {
  const entries = readdirSync(path);

  let commands: Command[] = [];

  for (const entry of entries) {
    const fullPath = join(path, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const nestedCommands = await getCommands(fullPath);
      commands = commands.concat(nestedCommands);
    } else if ([".ts", ".js"].includes(extname(fullPath))) {
      const { default: command }: { default: Command } = await import(fullPath);
      commands.push(command);
    }
  }
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
