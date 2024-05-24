const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (interaction) => 
{

	const member = interaction.guild.members.cache.get(interaction.user.id);
	const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
	const description = interaction.message.embeds[0].description;

	const rr = data['Reaction Roles'][description];
	const roleId = rr.roleId;
	const role = interaction.guild.roles.cache.get(roleId);

	const roleAdd = new EmbedBuilder().setColor('00FF00').setDescription(`**${role} has been added!**`);
	const roleRemove = new EmbedBuilder().setColor('FF0000').setDescription(`**${role} has been removed!**`);

	// Require GUILD MEMBER role:
	// if (roleId === '1183240686678589541')
	// { if (!member.roles.cache.has(config.gmemberRole)) { return interaction.reply({ content: 'You must be a guild member to join our SMP!', ephemeral: true }); } }

	if (member.roles.cache.has(role.id)) {
		await member.roles.remove(role);
		await interaction.reply({ embeds: [roleRemove], ephemeral: true });
	} else {
		await member.roles.add(role);
		await interaction.reply({ embeds: [roleAdd], ephemeral: true });
	}
};