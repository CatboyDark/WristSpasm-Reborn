const hypixel = require('../../../contracts/hapi.js');

module.exports = {
	type: 'plain',
	name: 'discord',

	async execute(message, args) 
	{
		if (args.length === 0) 
		{
			return message.reply('Please provide a username!');
		}
		message.channel.send(`You provided the argument: ${args[0]}`);
	}
};
