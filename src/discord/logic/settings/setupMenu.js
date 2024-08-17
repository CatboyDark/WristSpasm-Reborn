const { createMsg, createRow } = require('../../../helper/builder.js');

const setupMsg = createMsg({
	title: 'Getting Started',
	desc: 
		'**Hello!** Thank you for using Eris!\n\n' +
		'This command edits the **config.json** file in your bot folder.\n' +
		'You can manually adjust these settings anytime.\n\n' +
		'Let\'s start by filling out the required **Settings** for the bot to function!'
});

const setupButtons = createRow([
	{ id: 'settings', label: 'Settings', style: 'Green' },
	{ id: 'features', label: 'Features', style: 'Green' },
	{ id: 'logging', label: 'Logs', style: 'Blue' }
]);

const back = createRow([
	{ id: 'backToSetup', label: 'Back', style: 'Gray' }
]);

async function backToSetup(interaction)
{
	await interaction.update({ embeds: [setupMsg], components: [setupButtons] });
}

module.exports = 
{ 
	setupMsg,
	setupButtons,
	back,
	backToSetup
};