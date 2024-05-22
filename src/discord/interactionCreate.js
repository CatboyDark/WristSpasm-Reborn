const { Events } = require('discord.js');

const fs = require('fs');
const path = require('path');
const lDir = path.join(__dirname, 'logic');
const lFiles = fs.readdirSync(lDir).filter(file => file.endsWith('.js'));

const Logic = lFiles.reduce((acc, file) => {
    const filePath = path.join(lDir, file);
    const logicFunction = require(filePath);
    const functionName = file.replace('.js', '');
    acc[functionName] = logicFunction;
    return acc;
}, {});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) 
	{
		if (interaction.isChatInputCommand())
		{
			const command = interaction.client.commands.get(interaction.commandName);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		else if (interaction.isButton())
		{
			const buttonId = interaction.customId;
			
			switch (buttonId) 
			{
				case 'rr':
					await Logic.rrLogic(interaction);
				break;

				case 'link':
					await Logic.linkLogic(interaction);
				break;

				case 'linkhelp':
					await Logic.linkhelpLogic(interaction);
				break;
			}
		}
		else if (interaction.isModalSubmit())
		{
			const modal = interaction.modalId;

			switch (modal)
			{
				case 'linkM':
					await interaction.reply({ content: 'Your submission was received successfully!' });
            	break;
			}
		}
		else { return; }
	},
};