const { EmbedBuilder } = require('discord.js');
const { WristSpasm, welcomeChannel, welcomeRole } = require('../config.json');

module.exports = client => {
    client.on('guildMemberAdd', (member) => 
    {

        if (member.guild.id !== WristSpasm) { return; }

        const channel = member.guild.channels.cache.get(welcomeChannel);
        const welcomeMsg = new EmbedBuilder()
	        .setColor(0x000000)
	        .setDescription(`**<@${member.id}> Welcome to the WristSpasm server!**`)

        channel.send({ embeds: [welcomeMsg] });

        member.roles.add(welcomeRole).catch(console.error)
    })
}
