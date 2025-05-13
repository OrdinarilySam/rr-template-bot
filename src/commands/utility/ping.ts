import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/Command";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply("Pong!");
}

const command: Command = { data, execute };
export default command;
