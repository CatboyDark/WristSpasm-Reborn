const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const lDir = path.join(__dirname, '../logic');
const lFiles = fs.readdirSync(lDir).filter(file => file.endsWith('.js'));

const Logic = lFiles.reduce((acc, file) => {
    const filePath = path.join(lDir, file);
    const logicModule = require(filePath);
    const functionName = file.replace('.js', '');
    if (typeof logicModule === 'object' && logicModule !== null) {
        Object.keys(logicModule).forEach(key => { acc[key] = logicModule[key]; }); } 
	else { acc[functionName] = logicModule; }
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
			const buttons = interaction.customId;
			
			switch (buttons) 
			{
				case 'rr':
					await Logic.rrLogic(interaction);
				break;

				case 'link':
					await Logic.linkMsg(interaction);
				break;

				case 'linkhelp':
					await Logic.linkHelp(interaction);
				break;
			}
		}
		else if (interaction.isModalSubmit())
		{
			const modals = interaction.customId

			switch (modals)
			{
				case 'linkM':
					await Logic.linkLogic(interaction);
            	break;
			}
		}
		else { return; }
	}
};
