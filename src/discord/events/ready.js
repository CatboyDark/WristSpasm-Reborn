const { statusChannel } = require('../../../config.json');
const welcome = require('../features/welcome.js')
const { Events, EmbedBuilder } = require('discord.js');

let status;

const dcOnline = new EmbedBuilder()
	.setColor(0x00FF00)
	.setDescription('**Status: Online!**')

module.exports = {
	name: Events.ClientReady,
	async execute(client) 
	{

		const channel = client.channels.cache.get(statusChannel)
		status = await channel.send({ embeds: [dcOnline] });

		console.log(`Discord is online!`);

		welcome(client);
	},
};
