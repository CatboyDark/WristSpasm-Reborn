const { createModal, createMsg, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig } = require('../../../helper/utils.js');

const invalidRole = createError('**That\'s not a valid Role ID!**');

async function setStaffRole(interaction) 
{
	if (!interaction.isModalSubmit())
	{
		const modal = createModal({
			id: 'setStaffRoleForm',
			title: 'Set Staff Role(s)',
			components: [{
				id: 'setStaffRoleInput',
				label: 'STAFF ROLE ID:',
				style: 'short',
				required: true
			}]
		});
		
		return interaction.showModal(modal);
	}

	const input = interaction.fields.getTextInputValue('setStaffRoleInput');
	const role = interaction.guild.roles.cache.get(input);
	if (!role) return interaction.reply({ embeds: [invalidRole], ephemeral: true });

	const roleIDs = interaction.guild.roles.cache
		.filter(r => r.position >= role.position)
		.map(r => r.id)
		.sort((a, b) => interaction.guild.roles.cache.get(b).position - interaction.guild.roles.cache.get(a).position);

	const serverID = interaction.guild.id;
	const config = readConfig();
	config.staffRole = roleIDs;
	config.serverID = serverID;
	writeConfig(config);
	const newRoles = roleIDs.map(roleID => `<@&${roleID}>`).join('\n');
	interaction.reply({ embeds: [createMsg({ desc: `**Staff Role(s) have been set to:**\n\n${newRoles}` })], ephemeral: true });
}

module.exports = 
{
	setStaffRole
};