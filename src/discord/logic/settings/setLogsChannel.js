const { createModal, createMsg } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

async function setLogsChannel(interaction) 
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setLogsChannelForm',
			title: 'Set Logs Channel',
			components: [{
				id: 'setLogsChannelInput',
				label: 'LOGS CHANNEL ID:',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setLogsChannelInput');
	const channel = await interaction.guild.channels.fetch(input).catch(() => null);
	if (!channel) return interaction.reply({ embeds: [createMsg({ color: 'FF0000', desc: '**That\'s not a valid Channel ID!**' })], ephemeral: true });

	const config = readConfig();
	config.logsChannel = input;
	writeConfig(config);
	interaction.reply({ embeds: [createMsg({ desc: `**Logs Channel has been set to** <#${input}>` })], ephemeral: true });
}

module.exports = 
{
	setLogsChannel
};