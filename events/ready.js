const logs = require("./config.json");
const { Events, EmbedBuilder } = require('discord.js');

const online = new EmbedBuilder()
	.setColor(0x000000)
	.setTitle('Bot is online!')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) 
	{
		console.log(`r`);
		client.channels.cache.get(logs).send({ embeds: [online] });
	},
};