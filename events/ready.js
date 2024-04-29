const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) 
	{
		console.log(`r`);
	},
};

client.on(Events.MessageCreate, () => {

	console.log('Message Recieved');
	
});