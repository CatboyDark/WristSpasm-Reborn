const { createSlash } = require('../../../helper/builder.js');
const { createCommandDataMsg, dataButtons } = require('../../logic/data.js');

module.exports = createSlash({
	name: 'data',
	desc: 'Display bot usage data',

	async execute(interaction) 
	{
		const embed = await createCommandDataMsg();
		await interaction.reply({ embeds: [embed], components: [dataButtons] });
	}
});