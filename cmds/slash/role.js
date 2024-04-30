const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const role = new EmbedBuilder()
	.setColor(0x000000)
	.setTitle('WIP')

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add/Remove a user\'s roles')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addUserOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
		
	async execute(interaction) {
		await interaction.reply({ embeds: [role] });
	},
};	