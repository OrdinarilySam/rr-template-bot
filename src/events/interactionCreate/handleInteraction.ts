import { Events, Interaction } from "discord.js";
import { Event } from "../../types/Event";

async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
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
}

const handleInteraction: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute,
};

export default handleInteraction;
