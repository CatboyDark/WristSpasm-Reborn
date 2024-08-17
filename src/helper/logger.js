/* eslint-disable indent */

const { createMsg } = require('./builder.js');
const db = require('../mongo/schemas.js');
const { readConfig } = require('./utils.js');

async function cmdCounter(command) 
{
    await db.Command.findOneAndUpdate(
        { command },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
    );
}

async function buttonCounter(button, source)
{
	await db.Button.findOneAndUpdate(
		{ button },
        { $inc: { count: 1 }, $set: { source } },
        { upsert: true, new: true }
	);
}

async function createLogMsg(interaction) 
{
	const config = readConfig();

	if (!config.logs.enabled) return null;

	let title;
	let desc;

	switch (true) 
	{
		case interaction.isChatInputCommand():
			if (config.logs.commands) 
			{
				const messageId = await interaction.fetchReply().then(reply => reply.id);
				const options = interaction.options.data.map(option => 
					option.type === 6 ? ` <@${option.value}> ` : 
					option.type === 8 ? ` <@&${option.value}> ` : 
					` ${option.value} `
				);

        		const optionsString = options.length > 0 ? `**[**${options.join('**,** ')}**]**` : '';

				title = 'Command';
				desc = 
						`<@${interaction.user.id}> ran **/${interaction.commandName}** ${optionsString}\n` +
						`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`;
			} 
			else return null;
			break;

		case interaction.isButton():
			if (config.logs.buttons) 
			{
				title = 'Button';
				desc = 
						`<@${interaction.user.id}> clicked **${interaction.component.label}**.\n` +
						`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.message.id}`;
			} 
			else return null;
			break;

		case interaction.isStringSelectMenu():
			if (config.logs.menus)
			{
				const selectMenu = interaction.component;
				const selectedValues = interaction.values;
				const optionLabels = selectedValues.map(value => {
					const option = selectMenu.options.find(option => option.value === value);
					return option ? option.label : value;
				});
				title = 'Menu';
				desc = 
						`<@${interaction.user.id}> selected **${optionLabels.join(', ')}** from **${interaction.component.placeholder}**\n` +
						`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.message.id}`;
			} 
			else return null;
			break;

		case interaction.isModalSubmit():
			if (config.logs.forms) 
			{
				title = 'Form';
				desc = 
						`<@${interaction.user.id}> submitted **${interaction.customId}**\n` +
						`https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.message.id}`;
			} 
			else return null;
			break;
	}

	const icon = interaction.user.displayAvatarURL();
	return createMsg({ icon, title, desc, timestamp: 'relative' });
}

async function log(interaction) 
{
	if (interaction.isChatInputCommand()) await cmdCounter(interaction.commandName);
	if (interaction.isButton()) await buttonCounter(interaction.component.label, interaction.customId);

	const config = readConfig();
	const logsChannel = await interaction.guild.channels.cache.get(config.logsChannel);
	const message = await createLogMsg(interaction);
	if (message) await logsChannel.send({ embeds: [message] });
}

module.exports = log;
