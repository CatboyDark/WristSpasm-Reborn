const { createHelpMsg, helpButtons } = require('../../logic/help.js');
const { createSlash } = require('../../../helper/builder.js');

module.exports = createSlash({
	name: 'help',
	desc: 'Display bot info',
    
	async execute(interaction) 
	{
		const embed = await createHelpMsg(interaction);
		await interaction.reply({ embeds: [embed], components: [helpButtons] });
	}
});