const { createHelpMsg, helpButtons } = require('../../logic/help.js');
const { createSlash } = require('../../../helper/builder.js');

module.exports = createSlash({
	name: 'help',
	desc: 'Display bot info',
    
	async execute(interaction) 
	{
		const helpMsg = await createHelpMsg(interaction);
		await interaction.reply({ embeds: [helpMsg], components: [helpButtons] });
	}
});