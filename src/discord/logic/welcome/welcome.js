const { createMsg } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');

async function welcomeMsg(member)
{
	const config = readConfig();
	if (!config.features.welcomeMsgToggle) return;

	let welcomeMsg = config.features.welcomeMsg || `### Welcome to the ${config.guild} server!\n### @member`;
	welcomeMsg = welcomeMsg.replace(/@member/g, member.toString());

	const msg = createMsg({
		desc: welcomeMsg,
		icon: member.user.displayAvatarURL()
	});
	const channel = member.guild.channels.cache.get(config.features.welcomeChannel); 

	if (config.features.welcomeMsg.includes('@member'))
	{
		const ghostPing = await channel.send(`||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| ${member.toString()}`);
		setTimeout(() => { ghostPing.delete(); }, 1000);
	}
	await channel.send({ embeds: [msg] });
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