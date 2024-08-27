const { readConfig } = require('../../helper/utils.js');

module.exports = 
{
	command: 'kath',
	chat: ['guild', 'staff', 'party', 'dm'],

	execute(client, bot) 
	{
		console.log('e')
		bot.send('/oc kath is a raging homosexual');

		const config = readConfig();
		const logsChannel = client.channels.cache.get(config.logsChannel);

		if (logsChannel) 
			logsChannel.send(`Command: ${bot.msg.content}\nSender: ${bot.msg.sender}\nChat: ${bot.msg.chat}\nRank: ${bot.msg.rank}\nGuild Rank: ${bot.msg.guildRank}`);
		else
			console.error('Logs channel not found.');
	}
};
