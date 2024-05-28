const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { linkedRole, gRole } = require('../../../../config.json');
const hypixel = require('../../../contracts/hapi.js');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Update your roles'),

	async execute(interaction) 
	{
		const unLinked = new EmbedBuilder().setColor('FF0000').setDescription('You are not verified! Please link your account using /link.');

		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
		const uLinked = data.Linked || [];

		if (!interaction.member.roles.cache.has(linkedRole)) 
		{ await interaction.reply({ embeds: [unLinked], ephemeral: true }); return; }

		const u = uLinked.find(user => user.dcid === interaction.user.id);
		try {
			const LinkedPlayer = await hypixel.getPlayer(u.ign);
			if (LinkedPlayer.success && LinkedPlayer.player) {
				if (LinkedPlayer.player.guild) {
					console.log(`${u.ign} is in a guild named ${LinkedPlayer.player.guild.name}.`);
				} else {
					console.log(`${u.ign} is not in any guild.`);
				}
			} else {
				console.log(`Failed to retrieve player data for ${u.ign}`);
				await interaction.reply('e')
			}
		} catch (error) {
			console.error(`Error retrieving player data for ${u.ign}:`, error);
		}
		// if (!guild) {
		// 	console.log('No guild data found for player.');
		// 	await interaction.reply({ content: 'No guild data found for your player.', ephemeral: true });
		// 	return;
		// }

		// console.log('Guild data:', guild);

		// if (guild && guild.name === 'WristSpasm' && !interaction.member.roles.cache.has(gRole))
		// { 
		// 	console.log(`@${interaction.user.tag} is a guild member!`);
		// 	// 	await interaction.user.roles.add(gRole);

		// 	// 	const map = await hypixel.getSkyblockMember(player.uuid);
		// 	// 	console.log(map);

		// 	// }
		// 	// else if (guild && guild.name !== 'WristSpasm' && interaction.user.roles.cache.has(gRole))
		// 	// { 
		// 	// 	await interaction.user.roles.remove(gRole); 
		// 	// 	console.log(`@${interaction.user.tag} is not a guild member!`);
		// 	// }
		// 	// else { console.log('unhandled error :(');}
		// } 
	}
};
