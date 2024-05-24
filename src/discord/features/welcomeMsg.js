const { EmbedBuilder } = require('discord.js');
const { WristSpasm, welcomeChannel } = require('../../../config.json');

module.exports = client => 
{
	client.on('guildMemberAdd', (member) => 
	{
		const welcomeMsg = new EmbedBuilder()
			.setColor('000000')
			.setDescription(`**<@${member.id}> Welcome to the WristSpasm server!**`);

		if (member.guild.id !== WristSpasm) { return; }

		const channel = member.guild.channels.cache.get(welcomeChannel);
		setTimeout(() => { channel.send({ embeds: [welcomeMsg] }); }, 1000);
	});
};
