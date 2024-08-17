const { ActivityType } = require('discord.js');
const { createModal, createMsg } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

async function setGuild(interaction)
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setGuildForm',
			title: 'Set Guild',
			components: [{
				id: 'setGuildInput',
				label: 'GUILD:',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setGuildInput');
	await interaction.client.user.setActivity(`${input}`, {type: ActivityType.Watching});
	const config = readConfig();
	config.guild = input;
	writeConfig(config);
	await interaction.reply({ embeds: [createMsg({ desc: `Guild has been set to **${input}**` })], ephemeral: true });
}

module.exports = 
{ 
	setGuild
};