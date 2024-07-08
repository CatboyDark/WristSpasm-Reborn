const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { linkedRole, gRole, sbRoles } = require('../../../../config.json');
const hypixel = require('../../../contracts/hapi.js');

const unLinked = new EmbedBuilder().setColor('FF0000').setDescription('**You are not linked!**\n_ _\nThis should not be possible. Please ask a staff member for help.');

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Update your roles'),

	async execute(interaction) 
	{
		try
		{
			await interaction.deferReply();

			if (!interaction.member.roles.cache.has(linkedRole))
			{
				await interaction.followUp({ embeds: [unLinked] });
				return;
			}

			const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
			const DataL = data.Linked || [];
			const player = DataL.find(user => user.dcid === interaction.user.id);

			if (!player)
			{
				await interaction.followUp({ embeds: [unLinked] });
				return;
			}

			const guild = await hypixel.getGuild('player', `${player.ign}`);

			const addedRoles = [];
			const removedRoles = [];

			if (guild && guild.name === 'WristSpasm')
			{
				if (!interaction.member.roles.cache.has(gRole))
				{
					await interaction.member.roles.add(gRole); 
					addedRoles.push(gRole);
				}
			}
			else
			{
				if (interaction.member.roles.cache.has(gRole))
				{
					await interaction.member.roles.remove(gRole); 
					removedRoles.push(gRole);
				}
			}

			const sbMember = await hypixel.getSkyblockMember(`${player.uuid}`);

			let highestLevel = 0;
			for (const [profileName, profileData] of sbMember.entries())
			{ if (highestLevel < profileData.level) { highestLevel = profileData.level; } }

			let assignedRole = sbRoles[0].roleId;
			for (const role of sbRoles)
			{
				if (highestLevel >= role.level)
				{ assignedRole = role.roleId; }
				else { break; }
			}

			if (!interaction.member.roles.cache.has(assignedRole))
			{
				await interaction.member.roles.add(assignedRole);
				addedRoles.push(assignedRole);
			}

			for (const sbRole of sbRoles)
			{
				if (interaction.member.roles.cache.has(sbRole.roleId) && sbRole.roleId !== assignedRole)
				{
					await interaction.member.roles.remove(sbRole.roleId);
					removedRoles.push(sbRole.roleId);
				}
			}

			let desc;
			if (addedRoles.length > 0 && removedRoles.length > 0)
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${addedRoles.map(roleId => `<:plus:1259498381206618164> <@&${roleId}>`).join('\n')}\n_ _\n`;
				desc += `${removedRoles.map(roleId => `<:minus:1259498392116133918> <@&${roleId}>`).join('\n')}`;
			}
			else if (addedRoles.length > 0)
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${addedRoles.map(roleId => `<:plus:1259498381206618164> <@&${roleId}>`).join('\n')}\n_ _`;
			}
			else if (removedRoles.length > 0)
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${removedRoles.map(roleId => `<:minus:1259498392116133918> <@&${roleId}>`).join('\n')}\n_ _`;
			}
			else
			{
				desc = '**Your roles are up to date!**';
			}

			const success = new EmbedBuilder().setColor('00FF00').setDescription(desc);

			interaction.followUp({ embeds: [success] });
		}
		catch (e) { console.log(e); } 
	}
};
