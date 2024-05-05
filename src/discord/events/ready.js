const { statusChannel } = require('../../../config.json');
const welcome = require('../features/welcome.js')
const { Events, EmbedBuilder } = require('discord.js');

let status;

const dcOnline = new EmbedBuilder()
	.setColor(0x00FF00)
	.setDescription('**Discord: Online!**')

module.exports = {
	name: Events.ClientReady,
	async execute(client) 
	{
		console.log(`r`);

		const channel = client.channels.cache.get(statusChannel)
		status = await channel.send({ embeds: [dcOnline] });

		welcome(client);
	},
};
