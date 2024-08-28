const { restart } = require('../../logic/restart.js');

module.exports =
{
	name: 'restart',
	desc: 'Restarts and updates the bot',
	permissions: ['ManageGuild'],
    
	async execute(interaction) 
	{
		await interaction.deferReply();

		await restart();

		await interaction.followUp(`**${interaction.client.user.username} has been restarted!**`);
	}
};