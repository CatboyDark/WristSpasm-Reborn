const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const permCheck = (interaction, user, role) =>
{
	const noAddPerms = new EmbedBuilder().setColor('FF0000').setDescription('**You do not have permission to assign this role.**');
	const noRemovePerms = new EmbedBuilder().setColor('FF0000').setDescription('**You do not have permission to remove this role.**');

	if (interaction.member.roles.highest.comparePositionTo(role) <= 0) 
	{
		if (user.roles.cache.has(role.id)) 
		{  interaction.reply({ embeds: [noRemovePerms]}); return true; }
		else {  interaction.reply({ embeds: [noAddPerms] }); return true; }
	}
	return false;
};

module.exports =
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add or remove a user\'s roles')
		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

	async execute(interaction) 
	{
		const user = interaction.options.getMember('user');
		const role = interaction.options.getRole('role');

		const roleAdd = new EmbedBuilder().setColor('00FF00').setDescription(`**${user} is now ${role}.**`);
		const roleRemove = new EmbedBuilder().setColor('FF0000').setDescription(`**${user} is no longer ${role}.**`);

		if (permCheck(interaction, user, role)) { return; }

		if (user.roles.cache.has(role.id)) {
			user.roles.remove(role);
			await interaction.reply({ embeds: [roleRemove] });} 
		else {
			user.roles.add(role);
			await interaction.reply({ embeds: [roleAdd] });
		}
	}
};
