const { createModal, createMsg, createError } = require('../../../helper/builder.js');
const { createLinkMsg, linkButtons } = require('./link.js');

const invalidChannel = createError('**That\'s not a valid Channel ID!**');

async function setLinkChannel(interaction)
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setLinkChannelForm',
			title: 'Set Link Channel',
			components: [{
				id: 'setLinkChannelInput',
				label: 'CHANNEL ID:',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal); 
	}

	const input = await interaction.fields.getTextInputValue('setLinkChannelInput');
	const channel = await interaction.guild.channels.fetch(input).catch(() => null);
	if (!channel) return interaction.reply({ embeds: [invalidChannel], ephemeral: true });

	await channel.send({ embeds: [await createLinkMsg()], components: [linkButtons] });
	interaction.reply({ embeds: [createMsg({ desc: `**Link Channel has been set to** <#${input}>` })], ephemeral: true });
}

module.exports =
{
	setLinkChannel
};