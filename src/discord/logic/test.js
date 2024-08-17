const { createMsg } = require('../../helper/builder.js');
const { readConfig } = require('../../helper/utils.js');
const { Pin } = require('../../mongo/schemas.js');

const config = readConfig();
const logsChannel = config.logsChannel;

// Initialize all pins in the database for the given guild
async function initializeAllPins(guild) {
	try {
		const channels = guild.channels.cache.filter(channel => channel.isText());
		for (const channel of channels.values()) {
			await handleChannelPinsUpdate(channel);
		}
	} catch (error) {
		console.error('Failed to initialize pins for the guild:', error);
	}
}

// Handle pin updates and store in the database
async function handleChannelPinsUpdate(channel) {
	if (!channel || !channel.id) {
		console.error('No channel ID provided in the ChannelPinsUpdate event.');
		return;
	}

	try {
		// Fetch new pinned messages
		const newPinnedMessages = await channel.messages.fetchPinned();
		const newPinnedSet = new Set(newPinnedMessages.keys());

		// Get previously stored pinned messages
		const pinData = await Pin.findOne({ channelId: channel.id }).exec();
		const storedPins = pinData ? new Set(pinData.pinnedMessages) : new Set();

		// Compare new pinned messages with stored ones
		const addedPins = [...newPinnedSet].filter(id => !storedPins.has(id));
		const removedPins = [...storedPins].filter(id => !newPinnedSet.has(id));

		// Update the stored pinned messages
		await Pin.findOneAndUpdate(
			{ channelId: channel.id },
			{ pinnedMessages: Array.from(newPinnedSet) },
			{ upsert: true, new: true }
		).exec();

		// Handle newly pinned messages
		for (const id of addedPins) {
			const message = newPinnedMessages.get(id);
			if (message) {
				const embed = createMsg({
					title: 'Message Pinned',
					desc: `A message by ${message.author.tag} was pinned.`,
					fields: [
						{ title: 'Message Content', desc: message.content || 'No content', inline: false },
						{ title: 'Channel', desc: message.channel.name, inline: true },
						{ title: 'Author', desc: message.author.tag, inline: true }
					],
					timestamp: 'relative'
				});

				const logChannel = channel.client.channels.cache.get(logsChannel);
				if (logChannel) {
					logChannel.send({ embeds: [embed] });
				} else {
					console.error(`Log channel with ID ${logsChannel} not found.`);
				}
			}
		}

		// Handle removed pins if necessary (optional)
		for (const id of removedPins) {
			console.log(`Message with ID ${id} was unpinned.`);
		}
	} catch (error) {
		console.error('An error occurred while handling channel pins update:', error);
	}
}

module.exports = {
	handleChannelPinsUpdate,
	initializeAllPins
};