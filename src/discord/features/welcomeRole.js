const { WristSpasm, welcomeRole} = require('../../../config.json');

module.exports = client => 
    {
        client.on('guildMemberAdd', (member) => 
        {
            if (member.guild.id !== WristSpasm) { return; }
    
            member.roles.add(welcomeRole).catch(console.error)
        })
    }
    