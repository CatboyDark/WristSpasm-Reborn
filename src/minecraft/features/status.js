const { send } = require('../chat.js');

module.exports = (bot) => 
{
	bot.on('message', (message) => 
	{
		const text = message.toString().trim();

		if (text.startsWith('Officer >') && text.includes('.on')) 
		{ 
			bot.chat('/status online');
			setTimeout(() => { send(bot, '/oc Status has been set to: Online!'); }, 500);
		}

		if (text.startsWith('Officer >') && text.includes('.off')) 
		{ 
			bot.chat('/status offline');
			setTimeout(() => { send(bot, '/oc Status has been set to: Offline!'); }, 500);
		}
	});
};