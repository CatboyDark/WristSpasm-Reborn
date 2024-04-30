const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const help = new EmbedBuilder()
	.setColor(0x000000)
	.setTitle('WIP')

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('roles you!'),
		
	async execute(interaction) {
		await interaction.reply({ embeds: [help] });
	},
};