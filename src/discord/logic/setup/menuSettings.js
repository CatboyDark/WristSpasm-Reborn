const { createMsg, createRow } = require('../../../helper/builder.js');

const settingsMsg = createMsg({
	title: 'Settings',
	desc: 
		'1. **Guild** *Required*\n' +
        'Enter your Hypixel guild name.\n\n' +

		// '2. **Staff Role** *Required*\n' +
    	// 'Enter your staff role ID.\n' +
		// 'Role above staff role will be added automatically.\n\n' +
		// '*Note: Staff will be able to:*\n' +
		// '- *Delete messages*\n' +
		// '- *Assign roles below their highest role*\n\n' +

		'2. **Logs Channel** *Required*\n' +
		'Enter a channel ID for bot logs.\n' +
		'You can customize what events are sent to the Logs channel in the previous menu.\n\n' +

		'3. **Guild Icon**\n' +
        'Link an image of your guild icon.\n' +
		'If you do not, a default will be used.\n\n' +

		'4. **Color Theme**\n' +
        'Enter a 6 digit HEX.\n' +
        'This will be the bot\'s main color.'
});

const settingsButtons = createRow([
	{ id: 'setGuild', label: 'Guild', style: 'Green' },
	// { id: 'setStaffRole', label: 'Staff Roles', style: 'Green' },
	{ id: 'setLogsChannel', label: 'Logs Channel', style: 'Green' },
	{ id: 'setIcon', label: 'Icon', style: 'Green' },
	{ id: 'setColorTheme', label: 'Color Theme', style: 'Green' }
]);

const back = createRow([
	{ id: 'backToSetup', label: 'Back', style: 'Gray' }
]);

async function settings(interaction) 
{
	await interaction.update({ embeds: [settingsMsg], components: [settingsButtons, back] });
}

module.exports = 
{ 
	settings
};