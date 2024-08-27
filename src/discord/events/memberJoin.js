const { Events } = require('discord.js');
const { welcomeMsg, welcomeRole } = require('../logic/welcome/welcome.js');

module.exports = 
[
	{
		name: Events.GuildMemberAdd,
		async execute(member) 
		{
			await welcomeMsg(member);
			await welcomeRole(member);
		}
	}
];