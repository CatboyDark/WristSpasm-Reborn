const { createModal, createMsg, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

const invalidRole = createError('**That\'s not a valid role ID!**');
const noPerms = createError('**You do not have permission to assign that role!**');

async function setWelcomeRole(interaction)
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setWelcomeRoleForm',
			title: 'Set Welcome Channel',
			components: [{
				id: 'setWelcomeRoleInput',
				label: 'ROLE ID:',
				style: 'short',
				required: false
			}]
		});
	
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setWelcomeRoleInput');
	const role = interaction.guild.roles.cache.get(input);
	if (!role) 
	{
		return interaction.reply({ embeds: [invalidRole], ephemeral: true });
	}
	if (interaction.member.roles.highest.comparePositionTo(role) <= 0)
	{
		return interaction.reply({ embeds: [noPerms], ephemeral: true });
	}
	const config = readConfig();
	config.features.welcomeRole = input;
	writeConfig(config);
	interaction.reply({ embeds: [createMsg({ desc: `Welcome Role has been set to ${role}.` })], ephemeral: true });
}

module.exports = 
{
	setWelcomeRole
};