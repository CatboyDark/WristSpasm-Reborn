const { createMsg, createRow } = require('../../helper/builder.js');
const { readConfig } = require('../../helper/utils.js');
const db = require('../../mongo/schemas.js');

const dataButtons = createRow([
	{ id: 'commandData', label: 'Commands', style: 'Green' },
	{ id: 'buttonData', label: 'Buttons', style: 'Green' }
]);

async function createCommandDataMsg()
{
	const config = readConfig();
	const commandData = await db.Command.find({}).sort({ count: -1 }).exec();
	const commandDesc = commandData.map(cmd => `- **\`/${cmd.command}\`** ${cmd.count}`).join('\n');

	return createMsg({
		icon: config.icon,
		title: config.guild,
		desc: 
			'**Commands**\n' + 
			commandDesc
	});
}

async function createButtonDataMsg()
{
	const config = readConfig();
	const buttonData = await db.Button.find({}).sort({ count: -1 }).exec();
	const buttonDesc = buttonData.map(b => `- **\`${b.button}\`** (${b.source}): ${b.count}`).join('\n');

	return createMsg({
		icon: config.icon,
		title: config.guild,
		desc: '**Buttons**\n' + buttonDesc
	});
}

async function commandData(interaction)
{
	const embed = await createCommandDataMsg();
	return interaction.update({ embeds: [embed], components: [dataButtons] });
}

async function buttonData(interaction)
{
	const embed = await createButtonDataMsg();
	return interaction.update({ embeds: [embed], components: [dataButtons] });
}

module.exports =
{
	createCommandDataMsg,
	dataButtons,
	commandData,
	buttonData
};