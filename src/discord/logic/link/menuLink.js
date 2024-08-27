const { createMsg, createRow } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');

const linkFeaturesMsg = createMsg({
	title: 'Account Linking',
	desc:
		'Enter their IGN to link your Discord to Hypixel.\n' +
		'**Note**: This is required to enable **Custom Roles**.\n\n' +

		'1. **Linked Role**\n' +
		'Assign members a role when they link.\n' +
		'You may create a new role or set an existing role as the Linked Role.\n\n' +

		'2. **Guild Role**\n' +
		'Assign members a role if they are in your Guild.\n' +
		'You may create a new role or set an existing role as the Linked Role.'
});

async function createRow1()
{
	const config = readConfig();
	const buttons = createRow([
		{ id: 'setLinkChannel', label: 'Set Link Channel', style: 'Blue' },
		{ id: 'linkRoleToggle', label: 'Enable Link Role', style: config.features.linkRoleToggle },
		{ id: 'guildRoleToggle', label: 'Enable Guild Role', style: config.features.guildRoleToggle }
	]);

	return buttons;
}

const back = createRow([
	{ id: 'features', label: 'Back', style: 'Gray' }
]);

async function accountLinking(interaction)
{
	await interaction.update({ embeds: [linkFeaturesMsg], components: [await createRow1(), back] });
}

module.exports =
{
	accountLinking
};