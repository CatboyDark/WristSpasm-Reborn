const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Edit a user\'s roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option => option.setName('User').setDescription('')).setRequired(true)
        .addRoleOption(option => option.setName('Role').setDescription('')).setRequired(true),
        
	async execute(interaction) {
		    await interaction.reply('It works!');
	},
};