const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const success = new EmbedBuilder().setColor('00FF00').setDescription('**Success!**');

const info = new EmbedBuilder()
	.setColor('00FF00')
	.setDescription
	(
		'### <:gcheck:1244687091162415176> Link your Account!\n' +
        'Connect your Hypixel account to gain server access.\n' +
        '\n' +
        '*Please contact a staff member if the bot is down or if you require further assistance.*'
	);

const row = new ActionRowBuilder().addComponents(
	new ButtonBuilder().setCustomId('link').setLabel('Link').setStyle(ButtonStyle.Success),
	new ButtonBuilder().setCustomId('linkhelp').setLabel('How To Link').setStyle(ButtonStyle.Secondary)
);

module.exports =
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('slink')
		.setDescription('Setup Linking Channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		await interaction.channel.send({ embeds: [info], components: [row] });
		
		await interaction.reply({ embeds: [success], ephemeral: true });
	}
};