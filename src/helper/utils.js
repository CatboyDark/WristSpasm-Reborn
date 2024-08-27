/* eslint-disable no-unused-vars */

const hypixel = require('./hapi.js');
const { appID, token } = require('../../config.json');
const fs = require('fs');
const path = require('path');
const configs = path.join(__dirname, '../../config.json');

function readConfig()
{
	return JSON.parse(fs.readFileSync(configs, 'utf8'));
}

function writeConfig(newConfig)
{
	fs.writeFileSync(configs, JSON.stringify(newConfig, null, 2), 'utf8');
}

async function toggleConfig(path) 
{
	const config = readConfig();
	const keys = path.split('.');
	const lastKey = keys.pop();
	let current = config;

	for (const key of keys) 
	{
		if (current[key] === undefined) return console.log(`Path not found: ${path}`);
		current = current[key];
	}

	if (typeof current[lastKey] !== 'boolean') return console.log('This is not a valid config!');
	current[lastKey] = !current[lastKey];

	writeConfig(config);
}

function readLogic() 
{
	const dir = path.join(__dirname, '..', 'discord', 'logic');
	const modules = {};

	function loadFiles(directory) 
	{
		for (const file of fs.readdirSync(directory)) 
		{
			const filePath = path.join(directory, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) loadFiles(filePath);
			else if (file.endsWith('.js')) 
			{
				const moduleName = path.basename(file, '.js');
				const moduleExports = require(filePath);

				if (typeof moduleExports === 'object' && moduleExports !== null) Object.assign(modules, moduleExports);
				else modules[moduleName] = moduleExports;
			}
		}
	}

	loadFiles(dir);
	return modules;
}

async function getEmoji(name) 
{
	const url = `https://discord.com/api/v10/applications/${appID}/emojis`;

	try 
	{
		const { default: fetch } = await import('node-fetch');
		const response = await fetch(url, {
			headers: {
				Authorization: `Bot ${token}`
			}
		});
		if (!response.ok) throw new Error(`Failed to fetch emojis: ${response.statusText}`);

		const data = await response.json();

		const emojis = data.items;

		const emoji = emojis.find(e => e.name === name);
		return emoji ? `<:${emoji.name}:${emoji.id}>` : null;
	} 
	catch (error) 
	{
		console.error('Error fetching emoji:', error);
		throw error;
	}
}

async function getPlayer(user)
{
	const player = await hypixel.getPlayer(user);

	return player;
}

async function getDiscord(user)
{
	const player = await getPlayer(user);
	const discord = await player.socialMedia.find(media => media.id === 'DISCORD');

	return discord.link || null;
}

async function getGuild(type, value) 
{
	let guild;
    
	if (type === 'player') guild = await hypixel.getGuild('player', value);
	else if (type === 'guild') guild = await hypixel.getGuild('name', value);

	return guild;
}

async function getSBLevelHighest(player)
{
	const sbMember = await hypixel.getSkyblockMember(player.uuid);
	let highestLevel = 0;
	for (const [profileName, profileData] of sbMember.entries()) 
	{
		if (highestLevel < profileData.level) highestLevel = profileData.level;
	}

	return highestLevel;
}

async function getSBLevel(player)
{
	const data = await hypixel.getSkyblockProfiles(player).catch(() => null);
	const profile = data.find((profile) => profile.selected)?.me;

	if (profile === null || profile === undefined) return console.log('no profile');

	let level = profile.dungeons.experience.level;
	if (level > 50) level = 50;

	return level;
}

async function getCataHighest(player)
{
	const sbMember = await hypixel.getSkyblockMember(player.uuid);
	let highestLevel = 0;
	for (const [profileName, profileData] of sbMember.entries()) 
		if (highestLevel < profileData.dungeons.experience.level) highestLevel = profileData.dungeons.experience.level;
	if (highestLevel > 50) highestLevel = 50;
	return highestLevel;
}

async function getCata(player)
{
	const data = await hypixel.getSkyblockProfiles(player).catch(() => null);
	const profile = data.find((profile) => profile.selected)?.me;

	if (profile === null || profile === undefined) return console.log('no profile');

	let level = profile.dungeons.experience.level;
	if (level > 50) level = 50;

	return level;
}

async function getSkills(player, interaction)
{
	const sbMember = await hypixel.getSkyblockMember(player.uuid);
	let highestLevel = 0;
	let skillsMessage = '';

	for (const [profileName, profileData] of sbMember.entries()) {
		// Access the skills object
		const skills = profileData.skills;

		// Initialize message with profile name
		skillsMessage += `**Profile: ${profileName}**\n`;

		// Iterate over the skills object
		for (const [skill, level] of Object.entries(skills)) {
			// Check if the skill is a valid skill level object
			if (level && level.hasOwnProperty('level')) {
				// Append skill name and level to the message
				skillsMessage += `${skill.charAt(0).toUpperCase() + skill.slice(1)}: Level ${level.level}\n`;

				// Update highestLevel if this skill's level is higher
				if (level.level > highestLevel) {
					highestLevel = level.level;
				}
			}
		}

		// Add a line break between profiles
		skillsMessage += '\n';
	}

	// Send the skills data as a reply
	interaction.reply({
		content: skillsMessage || 'No skills data available.' // Make it visible only to the user who invoked the command
	});

	return highestLevel;
}

async function getNw(player) 
{
	try 
	{
		const sbMember = await hypixel.getSkyblockMember(player.uuid);

		for (const [profileName, profileData] of sbMember.entries()) 
		{
			console.log(await profileData.getNetworth());
		}
	}
	catch
	{
		console.log;
	}
}

async function updateRoles(interaction, player)
{
	const config = readConfig();

	const guild = await getGuild('player', player.uuid);

	const addedRoles = [];
	const removedRoles = [];

	// Assign Linked Role
	if (config.features.linkRoleToggle)
	{
		if (!interaction.member.roles.cache.has(config.features.linkRole))
		{
			await interaction.member.roles.add(config.features.linkRole);
			addedRoles.push(config.features.linkRole);
		}
	}

	// Assign Guild Role
	if (config.features.guildRoleToggle)
	{
		if (guild && guild.name === config.guild)
		{
			if (!interaction.member.roles.cache.has(config.features.guildRole))
			{
				await interaction.member.roles.add(config.features.guildRole); 
				addedRoles.push(config.features.guildRole);
			}
		}
		else
		{
			if (interaction.member.roles.cache.has(config.features.guildRole))
			{
				await interaction.member.roles.remove(config.features.guildRole); 
				removedRoles.push(config.features.guildRole);
			}
		}
	}

	// Assign Guild Ranks Roles
	if (config.features.guildRankRolesToggle)
	{
		if (guild && guild.name === config.guild)
		{
			const member = guild.members.find(member => member.uuid === player.uuid);
			const rank = member.rank;
			const rankIndex = guild.ranks.findIndex(r => r.name === rank) + 1;

			const toggleKey = `guildRank${rankIndex}Toggle`;
			const roleKey = `guildRank${rankIndex}Role`;

			if (config.features[toggleKey]) 
			{
				const roleID = config.guildRankRoles[roleKey];
				const role = interaction.guild.roles.cache.get(roleID);

				await interaction.member.roles.add(role);
				addedRoles.push(roleID);
			}

			for (const [key, id] of Object.entries(config.guildRankRoles)) 
			{
				if (key !== roleKey && id && interaction.member.roles.cache.has(id)) 
				{
					await interaction.member.roles.remove(id);
					removedRoles.push(id);
				}
			}
		}
	}

	// Assign SB Level Role
	if (config.features.levelRolesToggle)
	{
		const level = await getSBLevelHighest(player);
		const levelKey = Math.floor(level / 40) * 40;
		const assignedRole = config.levelRoles[levelKey];

		if (assignedRole) 
		{
			if (!interaction.member.roles.cache.has(assignedRole)) 
			{
				await interaction.member.roles.add(assignedRole);
				addedRoles.push(assignedRole);
			}
		}

		for (const roleID of Object.values(config.levelRoles)) 
		{
			if (roleID !== assignedRole && interaction.member.roles.cache.has(roleID)) 
			{
				await interaction.member.roles.remove(roleID);
				removedRoles.push(roleID);
			}
		}
	}

	// Assign SB Cata Role
	if (config.features.cataRolesToggle) 
	{
		const cata = await getCataHighest(player);
		const assignedRole = config.cataRoles[cata];

		if (assignedRole) 
		{
			if (!interaction.member.roles.cache.has(assignedRole)) 
			{
				await interaction.member.roles.add(assignedRole);
				addedRoles.push(assignedRole);
			}
		}

		for (const [level, roleID] of Object.entries(config.cataRoles)) 
		{
			if (parseInt(level) !== cata && interaction.member.roles.cache.has(roleID)) 
			{
				await interaction.member.roles.remove(roleID);
				removedRoles.push(roleID);
			}
		}
	}

	return { addedRoles, removedRoles };
}

module.exports =
{
	readConfig,
	writeConfig,
	toggleConfig,
	readLogic,
	getEmoji,
	getPlayer,
	getDiscord,
	getGuild,
	getSBLevelHighest,
	getSBLevel,
	getCataHighest,
	getCata,
	getSkills,
	getNw,
	updateRoles
};