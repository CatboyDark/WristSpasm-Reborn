const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) 
	{
		console.log(`r`);
		client.channels.cache.get('1234634679349415967').send({ content: 'Bot is online' });
	},
};