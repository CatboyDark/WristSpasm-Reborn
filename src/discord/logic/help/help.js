const { PermissionFlagsBits } = require('discord.js');
const { createMsg, createRow } = require('../../../helper/builder.js');
const fs = require('fs');
const path = require('path');
const { readConfig } = require('../../../helper/utils.js');

async function createHelpMsg(interaction) 
{
	const config = readConfig();

	const cmdsDirectory = path.join(__dirname, '..', '..', 'cmds', 'slash');
	const cmds = fs.readdirSync(cmdsDirectory)
		.map(file => require(path.join(cmdsDirectory, file)))
		.filter(command => command && command.type && command.data);

	const userPermissions = BigInt(interaction.member.permissions.bitfield);
	
	const getPermissionName = (permissionBit) => 
	{
		return Object.keys(PermissionFlagsBits).find(key => PermissionFlagsBits[key] === permissionBit);
	};

	const hasAdminPermission = (userPermissions & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator;
	
	const hasPermission = (permissions) => 
	{
		if (hasAdminPermission) return true;
		if (permissions.length === 0) return true;
	
		const permissionBits = permissions.reduce((acc, perm) => {
			const permBit = PermissionFlagsBits[perm];
			if (permBit === undefined) throw new Error(`Unsupported permission: ${perm}`);
			return acc | BigInt(permBit);
		}, BigInt(0));
	
		return (userPermissions & permissionBits) === permissionBits;
	};

	const formatCommands = (commands) =>
		commands
			.sort((a, b) => a.data.name.localeCompare(b.data.name))
			.map(cmd => {
				let description = `- **\`/${cmd.data.name}\`** ${cmd.data.description}`;
				if (cmd.permissions && cmd.permissions.length > 0) 
				{
					const permissionsRequired = cmd.permissions.map(perm => getPermissionName(PermissionFlagsBits[perm])).join(', ');
					description += ` **(${permissionsRequired})**`;
				}
				return description;
			})
			.join('\n');

	const nonList = cmds.filter(cmd => !cmd.permissions || cmd.permissions.length === 0);
	const staffList = cmds.filter(cmd => cmd.permissions && cmd.permissions.length > 0 && hasPermission(cmd.permissions));
	const nonCommands = `**Commands**\n${formatCommands(nonList)}`;
	const staffCommands = staffList.length > 0 ? `\n\n**Staff Commands**\n${formatCommands(staffList)}` : '';

	return createMsg({
		icon: config.icon,
		title: config.guild,
		desc: `${nonCommands}${staffCommands}`,
		footer: 'Created by @CatboyDark',
		footerIcon: 'https://i.imgur.com/4lpd01s.png'
	});
}

const helpButtons = createRow([
	{id: 'MCcmds', label: 'Ingame Commands', style: 'Green'},
	{id: 'credits', label: 'Credits', style: 'Blue'},
	{id: 'support', label: 'Support', style: 'Blue'},
	{label: 'GitHub', url: 'https://github.com/CatboyDark/Eris'}
]);

async function cmds(interaction) 
{
	const embed = await createHelpMsg(interaction);

	if (interaction.isCommand()) 
		await interaction.reply({ embeds: [embed], components: [helpButtons] });
	else if (interaction.isButton())
		await interaction.update({ embeds: [embed], components: [helpButtons] });
	
}

module.exports = 
{ 
	cmds
};
