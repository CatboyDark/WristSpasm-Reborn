const { setupMsg, setupButtons } = require('../../logic/setup/menuSetup.js');
const { createSlash } = require('../../../helper/builder.js');

module.exports = createSlash({
	name: 'setup',
	desc: 'Bot setup',
	permissions: ['ManageGuild'],
		
	async execute(interaction) 
	{
		await interaction.reply({ embeds: [setupMsg], components: [setupButtons], ephemeral: true });
	}
});