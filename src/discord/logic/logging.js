/* eslint-disable indent */

const { createMsg, createRow, createError } = require('../../helper/builder.js');
const { readConfig, toggleConfig } = require('../../helper/utils.js');

const missingChannel = createError('**You must add a logs channel first!**');

const loggingMsg = createMsg({
	title: 'Logging',
	desc:
        '**Configure what events are sent to the Logs channel.**\n\n' +
        '1. `Commands`: Log commands run\n' +
        '2. `Buttons`: Log buttons pressed\n' +
		'2. `Menus`: Log select menu options pressed\n' +
        '3. `Forms`: Log forms submitted'
});

async function createButtons() 
{
	const config = readConfig();
	const logButtons = createRow([
		{ id: 'logCommandsToggle', label: 'Log Commands', style: config.logs.commands },
		{ id: 'logButtonsToggle', label: 'Log Buttons', style: config.logs.buttons },
		{ id: 'logMenusToggle', label: 'Log Menus', style: config.logs.menus },
		{ id: 'logFormsToggle', label: 'Log Forms', style: config.logs.forms }
	]);

	const backRow = createRow([
		{ id: 'backToSetup', label: 'Back', style: 'Gray' },
		{ id: 'logsToggle', label: 'Enable Logs', style: config.logs.enabled }
	]);

	return { logButtons, backRow };
}

async function logging(interaction) 
{
	const config = readConfig();

	if (!config.logsChannel)
	{
		interaction.reply({ embeds: [missingChannel], ephemeral: true });
	}
	else
	{
		switch (interaction.customId) 
		{
			case 'logsToggle':
				await toggleConfig('logs.enabled');
				break;

			case 'logCommandsToggle':
				await toggleConfig('logs.commands');
				break;

			case 'logButtonsToggle':
				await toggleConfig('logs.buttons');
				break;

			case 'logMenusToggle':
				await toggleConfig('logs.menus');
				break;

			case 'logFormsToggle':
				await toggleConfig('logs.forms');
				break;
			}
	
		const { logButtons, backRow } = await createButtons();
		interaction.update({ embeds: [loggingMsg], components: [logButtons, backRow] });
	}
}

module.exports = { logging };
