const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add/Remove a user\'s roles')
        .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role').setRequired(true)),
        
	async execute(interaction) {
		    await interaction.reply('It works!');
	},
};