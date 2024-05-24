/* eslint-disable indent */

const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const lDir = path.join(__dirname, '../logic');
const lFiles = fs.readdirSync(lDir).filter(file => file.endsWith('.js'));

const Logic = lFiles.reduce((acc, file) => 
{
	const logicModule = require(path.join(lDir, file));

	if (typeof logicModule === 'object' && logicModule !== null) 
	{ Object.assign(acc, logicModule); } 
	else { acc[file.replace('.js', '')] = logicModule; }

	return acc;
}, {});

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) 
	{
		if (interaction.isChatInputCommand()) 
		{
			const command = interaction.client.commands.get(interaction.commandName);

			await command.execute(interaction)
			.catch(error => {
				console.error(error);
				if (interaction.replied || interaction.deferred) 
				{ return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true }); } 
				else { return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); }
				});
		}
		else if (interaction.isButton()) {
			const buttons = interaction.customId;

			switch (buttons) {
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
		else if (interaction.isModalSubmit()) {
			const modals = interaction.customId;

			switch (modals) {
			case 'linkM':
				await Logic.linkLogic(interaction);
				break;
			}
		}
		else { return; }
	}
};