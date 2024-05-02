const { welcome } = require('../channels.json');

module.exports = client => {
    client.on('guildMemberAdd', (member) => 
    {
        const welcomeChannel = member.guild.channels.cache.get(welcome);
        const welcomeMsg = `<@${member.id}> Welcome to the WristSpasm server!`;

        welcomeChannel.send(welcomeMsg);
    })
}