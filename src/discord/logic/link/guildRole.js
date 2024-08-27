const { createModal, createRow, createError } = require('../../../helper/builder.js');
const { writeConfig, toggleConfig, readConfig } = require('../../../helper/utils.js');

const invalidRole = createError('**That\'s not a valid Role ID!**');

async function createButtons()
{
	const config = readConfig();

	const roleButtons = createRow([
		{ id: 'setLinkChannel', label: 'Set Channel', style: 'Blue' },
		{ id: 'linkRoleToggle', label: 'Toggle Link Role', style: config.features.linkRoleToggle },
		{ id: 'guildRoleToggle', label: 'Toggle Guild Role', style: config.features.guildRoleToggle }
	]);
	return roleButtons;
}

const back = createRow([
	{ id: 'features', label: 'Back', style: 'Gray' }
]);

async function guildRoleToggle(interaction)
{
	const config = readConfig();

	if (!config.features.guildRoleToggle)
	{
		if (!interaction.isModalSubmit())
		{
			const modal = createModal({
				id: 'guildRoleToggle',
				title: 'Set Guild Role',
				components: [{
					id: 'setGuildRoleInput',
					label: 'GUILD ROLE ID:',
					style: 'short',
					required: true
				}]
			});
				
			return interaction.showModal(modal);
		}

		const input = await interaction.fields.getTextInputValue('setGuildRoleInput');
		const role = interaction.guild.roles.cache.get(input);
		if (!role) return interaction.reply({ embeds: [invalidRole], ephemeral: true });

		config.features.guildRole = input;
		writeConfig(config);
	}

	await toggleConfig('features.guildRoleToggle');
	const roleButtons = await createButtons(interaction);
	await interaction.update({ components: [roleButtons, back] });
}

module.exports =
{
	guildRoleToggle
};