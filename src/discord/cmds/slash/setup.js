const { setupMsg, setupButtons } = require('../../logic/settings/setupMenu.js');
const { createSlash } = require('../../../helper/builder.js');

module.exports = createSlash({
	name: 'setup',
	desc: 'Bot setup',
	permissions: ['ManageGuild'],
		
	async execute(interaction) 
	{
		try
		{
			console.log(setupMsg, setupButtons);
			await interaction.reply({ embeds: [setupMsg], components: [setupButtons], ephemeral: true });
		}
		catch{
			console.log;
		}
	}
});