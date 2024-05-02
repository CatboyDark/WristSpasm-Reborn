const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add or remove a user\'s roles')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
		
	async execute(interaction) 
	{
		const user = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');

		if (interaction.member.roles.highest.comparePositionTo(role) > 0) 
		{
			if (user.roles.cache.has(role.id)) { 
				user.roles.remove(role).catch(console.error)
				await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${user} is no longer ${role}.`).setColor('#FF0000')] });
			} else { 
				user.roles.add(role).catch(console.error)
				await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${user} is now ${role}.`).setColor('#00FF00')] });
			}
		} 
		else {
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription('You do not have permission to give this role.').setColor('#000000')] });
		}
	}
};
