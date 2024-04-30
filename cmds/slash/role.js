const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const role = new EmbedBuilder()
	.setColor(0x000000)
	.setTitle('WIP')

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add/Remove a user\'s roles'),
		
	async execute(interaction) {
		await interaction.reply({ embeds: [role] });
	},
};	