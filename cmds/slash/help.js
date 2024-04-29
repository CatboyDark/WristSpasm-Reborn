const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Helps you!'),
	async execute(interaction) {
		await interaction.reply('WIP');
	},
};