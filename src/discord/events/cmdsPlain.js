const { Events } = require('discord.js');

module.exports = 
[
	{
		name: Events.MessageCreate,

		async execute(message) 
		{
			if (message.author.bot) return;

			const command = message.client.pc.get(message.content.toLowerCase());
			if (command && command.type === 'plain') 
			{ 
				command.execute(message); 
			}
		}
	}
];