const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const e = require('../../../e.js');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('rr')
		.setDescription('Create a reaction role message')
		.addStringOption(option => option.setName('desc').setDescription('Body text').setRequired(true))
		.addStringOption(option => option.setName('button').setDescription('Button text').setRequired(true))
		.addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))
		.addStringOption(option => option.setName('color').setDescription('Embed color (6 digit HEX)').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

	async execute(interaction) 
	{
		
		const success = new EmbedBuilder().setColor('00FF00').setDescription('**Success!**');
        
		const button = interaction.options.getString('button');
		const role = interaction.options.getRole('role');
		let color = interaction.options.getString('color');
		if (!/^([0-9A-F]{6})$/i.test(color)) { color = '000000'; }
		const desc = new EmbedBuilder().setColor(color).setDescription(interaction.options.getString('desc'));

		if (e.rrPermCheck(interaction, role)) { return; }

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('rr').setLabel(button).setStyle(ButtonStyle.Success));

		const msg = await interaction.channel.send({ embeds: [desc], components: [row] });

		// Datify

		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
		const reactionRoles = data['Reaction Roles'] || {};
		reactionRoles[interaction.options.getString('desc')] = {
			messageId: msg.id,
			roleId: role.id
		};

		data['Reaction Roles'] = reactionRoles;
		fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
        
		await interaction.reply({ embeds: [success], ephemeral: true });
		return;
	}
};
