const { statusChannel } = require('../config.json');
const welcome = require('../features/welcome.js')
const { Events, EmbedBuilder } = require('discord.js');

let status;

const online = new EmbedBuilder()
	.setColor(0x00FF00)
	.setTitle('Discord: Online!')

const mcOnline = new EmbedBuilder()
	.setColor(0x00FF00)
	.setDescription
	(
		'Discord: Online!\n',
		'Hypixel: Online!'
	)

module.exports = {
	name: Events.ClientReady,
	async execute(client) 
	{
		status = await statusChannel.send({ embeds: [online] });

		welcome(client);
	},
};

bot.on('spawn', () => {
	status.edit({ embeds: [mcOnline] })
  })