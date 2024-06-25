const { features: { bridgeToggle }, channels: { logsChannel } } = require('../../../config.json');
const ignore = JSON.parse(require('fs').readFileSync('ignore.json'));

module.exports = (bot, client) => 
{
	bot.on('message', message => // Ingame -> Discord
	{
		if (!bridgeToggle) { return; }

		const content = message.toString().trim();
		const isIgnored = ignore.some(ignoredPhrase => content.startsWith(ignoredPhrase));
		if (content.length < 1 || isIgnored) { return; }
		const channel = client.channels.cache.get(logsChannel);

		channel.send(`${content}`);
	});

	client.on('messageCreate', message => // Discord -> Ingame
	{
		if (!bridgeToggle) { return; }

		const channel = client.channels.cache.get(logsChannel);
		if (message.channel.id === channel?.id) 
		{
			const content = message.content;
			if (message.author.bot) { return; }

			bot.chat(content);
		}
	});
};
