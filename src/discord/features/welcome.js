const { EmbedBuilder } = require('discord.js');
const { WristSpasm, channels: { welcomeChannel }, features: { welcomeMsgToggle, welcomeRoleToggle }, roles: { welcomeRole } } = require('../../../config.json');

module.exports = client => 
{
	client.on('guildMemberAdd', async (member) => 
	{
		if (member.guild.id !== WristSpasm) { return; }

		if (welcomeMsgToggle) 
		{
			const welcomeMsg = new EmbedBuilder()
				.setColor('000000')
				.setDescription(`### Welcome to the WristSpasm server!\n### ${member}`)
				.setThumbnail(member.user.displayAvatarURL());

			const channel = member.guild.channels.cache.get(welcomeChannel);
			await channel.send({ embeds: [welcomeMsg] });
		}

		if (welcomeRoleToggle)
		{
			await member.roles.add(welcomeRole);
		}
	});
};
