const { createMsg, createRow, createModal, createError } = require('../../../helper/builder.js');
const { readConfig, writeConfig, toggleConfig } = require('../../../helper/utils.js');

const invalidRole = createError('**That\'s not a valid Role ID!**');

function createLevelRolesMsg() 
{
	const config = readConfig();
	const roles = Object.entries(config.levelRoles)
		.filter(([level, roleID]) => roleID)
		.map(([level, roleID]) => `<@&${roleID}> - **Level ${level}**`)
		.join('\n');

	if (roles.length === 0) 
		return createMsg({ title: 'Custom Roles: Level', desc: 'Assign roles based on the user\'s Skyblock level.\n\nYou do not need to assign a role to every level.' });

	return createMsg({ 
		title: 'Custom Roles: Level', 
		desc: `Assign roles based on the user's Skyblock level.\n\nYou do not need to assign a role to every level.\n### Active Roles:\n${roles}`
	});
}

function createRow3()
{
	const config = readConfig();
	const back = createRow([
		{ id: 'customRoles', label: 'Back', style: 'Gray' },
		{ id: 'levelRolesToggle', label: 'Enable Level Roles', style: config.features.levelRolesToggle }
	]);

	return back;
}

const levels = 
[
	{ id: 'level0', label: 'Level [0]', desc: '0-39' },
	{ id: 'level40', label: 'Level [40]', desc: '40-79' },
	{ id: 'level80', label: 'Level [80]', desc: '80-119' },
	{ id: 'level120', label: 'Level [120]', desc: '120-159' },
	{ id: 'level160', label: 'Level [160]', desc: '160-199' },
	{ id: 'level200', label: 'Level [200]', desc: '200-239' },
	{ id: 'level240', label: 'Level [240]', desc: '240-279' },
	{ id: 'level280', label: 'Level [280]', desc: '280-319' },
	{ id: 'level320', label: 'Level [320]', desc: '320-359' },
	{ id: 'level360', label: 'Level [360]', desc: '360-399' },
	{ id: 'level400', label: 'Level [400]', desc: '400-439' },
	{ id: 'level440', label: 'Level [440]', desc: '440-479' },
	{ id: 'level480', label: 'Level [480]', desc: '480-520' }
];

const row1 = createRow([
	{
	  id: 'levelRolesMenu',
	  placeholder: 'Add roles',
	  options: levels.map(option => ({
			value: option.id,
			label: option.label,
			desc: option.desc
	  }))
	}
]);

const row2 = createRow([
	{ id: 'removeLevelRole', label: 'Remove Role', style: 'Red' }
]);

async function levelRoles(interaction)
{
	await interaction.update({ embeds: [createLevelRolesMsg()], components: [row1, row2, createRow3()] });
}

async function createLevelRoles(interaction) 
{
	if (interaction.isStringSelectMenu()) 
	{
		const selectedOption = interaction.values[0];

		const level = levels.find(l => l.id === selectedOption);
    
		const modal = createModal({
			id: `${selectedOption}Form`,
			title: `${level.label} Role`,
			components: [{
				id: `${selectedOption}Input`,
				label: `ENTER ROLE ID FOR ${level.label}:`,
				style: 'short',
				required: true
			}]
		});
    
		await interaction.showModal(modal);
	}

	if (interaction.isModalSubmit()) 
	{
		const selectedOption = interaction.customId.replace('Form', '');
		const input = interaction.fields.getTextInputValue(`${selectedOption}Input`);

		const role = interaction.guild.roles.cache.get(input);
		if (!role) return interaction.reply({ embeds: [invalidRole], ephemeral: true });

		const levelNumber = selectedOption.replace('level', '');

		levelRoles[levelNumber] = input;

		const config = readConfig();
		config.levelRoles[levelNumber] = input;
		writeConfig(config);

		await levelRoles(interaction);
	}
}

async function levelRolesToggle(interaction)
{
	await toggleConfig('features.levelRolesToggle');
	await levelRoles(interaction);
}

async function removeLevelRole(interaction)
{
	if (interaction.isButton())
	{
		const modal = createModal({
			id: 'removeLevelRoleForm',
			title: 'Remove Level Role',
			components: [{
				id: 'removeLevelRoleInput',
				label: 'ENTER A LEVEL TO REMOVE:',
				style: 'short',
				required: true
			}]
		});
    
		await interaction.showModal(modal);
	}

	if(interaction.isModalSubmit())
	{
		const input = interaction.fields.getTextInputValue('removeLevelRoleInput');
		const config = readConfig();

		if(config.levelRoles[input])
		{
			config.levelRoles[input] = '';
			writeConfig(config);
			await levelRoles(interaction);
		}
		else
		{
			await interaction.reply({ embeds: [createMsg({ color: 'FF0000', desc: `**No role found for Level ${input}!**` })], ephemeral: true });
		}
	}
}

module.exports = 
{
	createLevelRoles,
	levelRoles,
	levelRolesToggle,
	removeLevelRole
};