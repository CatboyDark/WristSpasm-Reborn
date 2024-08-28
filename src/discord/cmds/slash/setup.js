const { setupMsg, setupButtons } = require('../../logic/setup/menuSetup.js');

module.exports =
{
	name: 'setup',
	desc: 'Bot setup',
	permissions: ['ManageGuild'],
		
	async execute(interaction) 
	{
		await interaction.reply({ embeds: [setupMsg], components: [setupButtons], ephemeral: true });
	}
};