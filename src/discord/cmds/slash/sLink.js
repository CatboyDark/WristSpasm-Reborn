const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { CatboyDark } = require('../../../../auth.json');

module.exports =
{
	data: new SlashCommandBuilder()
    .setName('slink')
	.setDescription('Setup Linking')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) 
	{
        if (interaction.user.id !== CatboyDark) 
        { return interaction.reply({ content: 'Only <@622326625530544128> can use this command!', ephemeral: true }); }

        const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription
        (
            '### <:greencheck:1242984422870093824> Link your Account!\n' +
            'Connect your Hypixel account to gain server access.\n' +
            '\n' +
            '*Please ping a staff member if the bot is down or if you require further assistance.*'
        );

        const click = new ButtonBuilder()
        .setCustomId('link')
		.setLabel('Link')
		.setStyle(ButtonStyle.Success);

        const help = new ButtonBuilder()
        .setCustomId('linkhelp')
		.setLabel('How To Link')
		.setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents( click, help );

        await interaction.channel.send({ embeds: [embed], components: [row] });

        interaction.reply({ content: 'Success!', ephemeral: true });
    }
}