const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { welcomeRole, welcomeRoleToggle, linkedRole, gRole, sbRoles } = require('../../../../config.json');

const hypixel = require('../../../contracts/hapi.js');
const { Errors } = require('hypixel-api-reborn');

const success = (interaction) =>
{
	const embed = new EmbedBuilder().setColor('00FF00').setDescription('<:gcheck:1244687091162415176> **Account linked!**');
	interaction.followUp({ embeds: [embed], ephemeral: true });
};

const invalidIGN = (interaction) => 
{
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Invalid Username!**');
	return interaction.followUp({ embeds: [embed], ephemeral: true });
};

const noPerms = (interaction) => {
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Uhhhhhh Missing Perms!**');
	interaction.followUp({ embeds: [embed], ephemeral: true });
};

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link override')
		.addUserOption(option => option.setName('discord').setDescription('Discord').setRequired(true))
		.addStringOption(option => option.setName('ign').setDescription('IGN').setRequired(true)),

	async execute(interaction) 
	{
		try
		{
			await interaction.deferReply({ ephemeral: true });

			const discord = await interaction.guild.members.fetch(interaction.options.getUser('discord').id);
			const ign = interaction.options.getString('ign');

			const player = await hypixel.getPlayer(ign);

			// Datify

			const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
			const DataL = data.Linked || [];
			const entry = DataL.find(entry => entry.dcid === discord.id);
			if (!entry)
			{ 			
				DataL.push
				({
					dcid: discord.id,
					uuid: player.uuid,
					ign: player.nickname
				});
			}
			else if (entry.ign !== player.nickname) { entry.ign = player.nickname; }
			fs.writeFileSync('data.json', JSON.stringify(data, null, 4));

			// Set Nickname + Assign linkedRole

			try { await discord.setNickname(player.nickname); } catch (e) { if (e.message.includes('Missing Permissions')) { noPerms(interaction); console.log(e); } }
			if (!discord.roles.cache.has(linkedRole)) { await discord.roles.add(linkedRole);  }
			if (welcomeRoleToggle) { if (discord.user.roles.cache.has(welcomeRole)) { discord.user.roles.remove(welcomeRole); } }

			// Assign gRole

			const guild = await hypixel.getGuild('player', `${player.nickname}`);
			if (guild && guild.name === 'WristSpasm') { if (!discord.roles.cache.has(gRole)) { await discord.roles.add(gRole); } }
			else { if (discord.roles.cache.has(gRole)) { await discord.roles.remove(gRole); } }

			// Assign sbRole

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

			if (!discord.roles.cache.has(assignedRole))
			{ await discord.roles.add(assignedRole); }

			for (const sbRole of sbRoles)
			{ if (discord.roles.cache.has(sbRole.roleId) && sbRole.roleId !== assignedRole) { await discord.roles.remove(sbRole.roleId); } }

			success(interaction);
		}
		catch (e) { console.log(e); if (e.message === Errors.PLAYER_DOES_NOT_EXIST) { return invalidIGN(interaction); } } 
	}
};
