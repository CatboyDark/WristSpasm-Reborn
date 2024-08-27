const { createMsg } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');

async function ghostPing(member, channel) 
{
	const ghostPingMessage = await channel.send(`${member}`);
	await ghostPingMessage.delete();
}

async function welcomeMsg(member)
{
	const config = readConfig();
	if (!config.features.welcomeMsgToggle) return;

	const welcomeChannel = member.guild.channels.cache.get(config.features.welcomeChannel); 
	if (welcomeChannel.guild.id !== member.guild.id) return;

	let welcomeMsg = config.features.welcomeMsg || `### Welcome to the ${config.guild} server!\n### @member`;
	welcomeMsg = welcomeMsg.replace(/@member/g, member.toString());
	const msg = createMsg({
		desc: welcomeMsg,
		icon: member.user.displayAvatarURL()
	});

	await welcomeChannel.send({ embeds: [msg] });
	await ghostPing(member, welcomeChannel);
}

async function welcomeRole(member)
{
	const config = readConfig();
	if (!config.features.welcomeRoleToggle) return;

	await member.roles.add(config.features.welcomeRole);
}

module.exports =
{
	welcomeMsg,
	welcomeRole
};