// const { Events } = require('discord.js');
// const { createMsg } = require('../../helper/builder.js');
// const { readConfig } = require('../../helper/utils.js');

// const config = readConfig();
// const logsChannel = config.logsChannel;

// async function handleChannelCreate(channel) 
// {
// 	console.log(channel);

// 	// Create the embed message
// 	const embed = createMsg({
// 		title: 'Channel Created',
// 		desc: 'A new channel was created.',
// 		fields: [
// 			{ title: 'Channel Name', desc: channel.name, inline: true },
// 			{ title: 'Channel ID', desc: channel.id, inline: true },
// 			{ title: 'Channel Type', desc: channel.type, inline: true },
// 			{ title: 'Guild', desc: `[${channel.guild.name}](https://discord.com/channels/${channel.guild.id})`, inline: true }
// 		],
// 		timestamp: 'relative' // Optional: Add a timestamp if desired
// 	});

// 	// Get the log channel from the client
// 	const logChannel = channel.client.channels.cache.get(logsChannel);

// 	if (logChannel) {
// 		try {
// 			// Send the embed message
// 			await logChannel.send({ embeds: [embed] });
// 		} catch (error) {
// 			console.error(`Failed to send message to log channel: ${error}`);
// 		}
// 	} else {
// 		console.error(`Log channel with ID ${logsChannel} not found.`);
// 	}
// }

// async function handleMessageDelete(message) {
// 	if (message.partial) {
// 		try {
// 			message = await message.fetch();
// 		} catch (error) {
// 			console.error('Failed to fetch the message:', error);
// 			return;
// 		}
// 	}

// 	const embed = createMsg({
// 		title: 'Message Deleted',
// 		desc: `A message by ${message.author.tag} was deleted.`,
// 		fields: [
// 			{ title: 'Message Content', desc: message.content || 'No content', inline: false },
// 			{ title: 'Channel', desc: `[${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})`, inline: true },
// 			{ title: 'Author', desc: message.author.tag, inline: true }
// 		],
// 		timestamp: 'relative'
// 	});

// 	const logChannel = message.client.channels.cache.get(logsChannel);
// 	if (logChannel) {
// 		logChannel.send({ embeds: [embed] });
// 	} else {
// 		console.error(`Log channel with ID ${logsChannel} not found.`);
// 	}
// }

// module.exports = [
// 	{
// 		name: Events.MessageDelete,
// 		async execute(...args) {
// 			await handleMessageDelete(...args);
// 		}
// 	},
// 	{
// 		name: Events.ChannelCreate,
// 		async execute(...args) {
// 			await handleChannelCreate(...args);
// 		}
// 	}
// ];
