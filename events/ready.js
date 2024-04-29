const { Events, EmbedBuilder } = require('discord.js');

const onlineEmbed = new EmbedBuilder()
	.setColor(0x000000)
	.setTitle('Bot is online!')
	
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) 
	{
		console.log(`r`);
		client.channels.cache.get('1234634679349415967').send({ embeds: [onlineEmbed] });
	},
};