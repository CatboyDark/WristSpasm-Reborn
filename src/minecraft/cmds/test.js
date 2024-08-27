const { readConfig } = require('../../helper/utils.js');

module.exports = 
{
	command: 'test',
	chat: ['guild'],

	execute(client, bot, msg) 
	{
		bot.send('/oc yes');

		const config = readConfig();
		const logsChannel = client.channels.cache.get(config.logsChannel);

		if (logsChannel) {
			logsChannel.send(`Command: ${msg.content}\nSender: ${msg.sender}\nChat: ${msg.chat}\nRank: ${msg.rank}\nGuild Rank: ${msg.guildRank}`);
		} else {
			console.error('Logs channel not found.');
		}
	}
};