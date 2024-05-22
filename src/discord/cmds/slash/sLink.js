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
            '### Link your Account!\n' +
            'Please connect your Hypixel account to gain server access.\n' +
            '\n' +
            '*Please ping a staff member if the bot is down or you require further assistance.*'
        );

        const click = new ButtonBuilder()
        .setCustomId('link')
		.setLabel('Meow!')
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