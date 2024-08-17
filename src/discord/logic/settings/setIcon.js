const { createModal, createMsg } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

async function setIcon(interaction) 
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setIconForm',
			title: 'Set Icon',
			components: [{
				id: 'setIconInput',
				label: 'IMAGE LINK:',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setIconInput');
	const config = readConfig();
	config.icon = input;
	writeConfig(config);
	await interaction.reply({ embeds: [createMsg({ desc: '**Icon has been updated!**' })], ephemeral: true });
	await interaction.followUp({ content: input, ephemeral: true });
}

module.exports = 
{
	setIcon
};