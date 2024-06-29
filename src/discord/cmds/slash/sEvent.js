const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

const embed = new EmbedBuilder().setColor('000000').setDescription('**Select an Event:**');

const row = new ActionRowBuilder().addComponents(new ButtonBuilder()
	.setCustomId('eventA')
	.setLabel('Event A')
	.setStyle(ButtonStyle.Success)
);

module.exports =
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('sevent')
		.setDescription('Setup Event')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
	}
};
