const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { linkedRole, gRole } = require('../../../../config.json');
const hypixel = require('../../../contracts/hapi.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Update your roles'),

	async execute(interaction) {
		const unLinked = new EmbedBuilder().setColor('FF0000').setDescription('You are not verified! Please link your account using /link.');

		if (!interaction.member.roles.cache.has(linkedRole)) {
			await interaction.reply({ embeds: [unLinked], ephemeral: true });
			return;
		}

		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
		const DataL = data.Linked || [];
		const u = DataL.find(user => user.dcid === interaction.user.id);

		if (!u) {
			await interaction.reply({ content: 'User not found in linked data.', ephemeral: true });
			return;
		}

		const handleError = async (message) => {
			console.error(message);
			await interaction.reply({ content: message, ephemeral: true });
		};

		const guild = await hypixel.getGuild('player', `${u.ign}`);
		if (guild) {
			const gMember = guild.name === 'WristSpasm';
			if (gMember && !interaction.member.roles.cache.has(gRole)) {
				await interaction.member.roles.add(gRole);
			} else if (!gMember && interaction.member.roles.cache.has(gRole)) {
				await interaction.member.roles.remove(gRole);
			}
		}

		const player = await hypixel.getPlayer(u.ign);
		if (!player) {
			await handleError('Player not found on Hypixel.');
			return;
		}
		
	}
};
