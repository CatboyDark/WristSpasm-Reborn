const { createMsg, createRow } = require('../../../helper/builder.js');

const customRolesMsg = createMsg({
	title: 'Custom Roles',
	desc:
		'Assign roles when a user links their Discord or runs `/roles`.\n\n' +
		
		'1. **Guild Ranks**\n' +
		'Assign roles based on the user\'s rank in your guild.\n\n' +

		'2. **Level**\n' +
		'Assign roles based on the user\'s Skyblock level.\n\n' +

		'3. **Networth**\n' +
		'Assign roles based on the user\'s networth.\n\n' +

		'4. **Skill**\n' +
		'Assign roles based on the user\'s skills.\n\n' +

		'5. **Dungeons**\n' +
		'Assign roles based on the user\'s Catacombs level.\n\n' +

		'6. **Dungeon Classes**\n' +
		'Assign roles based on the user\'s Dungeon class levels\n\n' +

		'7. **Slayers**\n' +
		'Assign roles based on the user\'s Slayer levels.\n\n'
});

const customRolesMenu = createRow([
	{ 
		id: 'customRolesMenu',
		placeholder: 'Enable custom roles',
		options:
		[
			{ value: 'guildRankRoles', label: 'Guild Rank Roles', desc: 'Guild ranks' },
			{ value: 'levelRoles', label: 'Level Roles', desc: 'Skyblock level' },
			{ value: 'nwRoles', label: 'Networth Roles', desc: 'Skyblock networth' },
			{ value: 'skillRoles', label: 'Skill Roles', desc: 'Skyblock skills' },
			{ value: 'cataRoles', label: 'Dungeon Roles', desc: 'Skyblock Catacombs levels' },
			{ value: 'classRoles', label: 'Dungeon Class Roles', desc: 'Dungeon Class levels' },
			{ value: 'slayerRoles', label: 'Slayer Roles', desc: 'Skyblock slayer levels' }
		]
	}
]);

const back = createRow([
	{ id: 'features', label: 'Back', style: 'Gray' }
]);

async function customRoles(interaction)
{
	await interaction.update({ embeds: [customRolesMsg], components: [customRolesMenu, back] });
}

module.exports =
{
	customRoles
};