const { createModal, createMsg, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

const invalidHEX = createError('**That\'s not a valid HEX color!**');

async function setColorTheme(interaction) 
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setColorThemeForm',
			title: 'Set Color Theme',
			components: [{
				id: 'setColorThemeInput',
				label: 'HEX COLOR (EX: \'FFFFFF\'):',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setColorThemeInput').trim();
	const hexRegex = /^[0-9a-fA-F]{6}$/;
	if (!hexRegex.test(input)) return interaction.reply({ embeds: [invalidHEX], ephemeral: true });

	const config = readConfig();
	config.colorTheme = input;
	writeConfig(config);
	interaction.reply({ embeds: [createMsg({ desc: `Color Theme has been set to **${input}**` })], ephemeral: true });
}

module.exports = 
{
	setColorTheme
};