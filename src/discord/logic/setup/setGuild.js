const { ActivityType } = require('discord.js');
const { createModal, createMsg, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig, getGuild } = require('../../../helper/utils.js');
const { Errors } = require('hypixel-api-reborn');

const invalidGuild = createError('**Invalid Guild!**');

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

	try 
	{
		const guild = await getGuild('guild', input);

		await interaction.client.user.setActivity(`${input}`, { type: ActivityType.Watching });
		const config = readConfig();
		config.guild = guild.name;
		writeConfig(config);

		await interaction.reply({ embeds: [createMsg({ desc: `Guild has been set to **${guild.name}**` })], ephemeral: true });
	} 
	catch (e) 
	{
		if (e.message === Errors.GUILD_DOES_NOT_EXIST) 
			return interaction.reply({ embeds: [invalidGuild], ephemeral: true });
	}
}

module.exports = 
{ 
	setGuild
};
