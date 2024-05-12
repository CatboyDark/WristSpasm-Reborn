const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports =
{
	data: new SlashCommandBuilder()
    .setName('rr')
	.setDescription('Create a reaction role message')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption(option => option.setName('desc').setDescription('Body text').setRequired(true))
    .addStringOption(option => option.setName('button').setDescription('Button text').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Select a role to give').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('Choose an embed color (6 digit HEX)').setRequired(false)),

    async execute(interaction) 
	{
        const button = interaction.options.getString('button');
		const role = interaction.options.getRole('role');
        let color = interaction.options.getString('color');

        function isHex(hex) { return /^([0-9A-F]{6})$/i.test(hex); }
        if (!isHex(interaction.options.getString('color'))) 
        { color = '000000' }

        if (interaction.member.roles.highest.comparePositionTo(role) <= 0) 
        { return interaction.reply({ content: 'You do not have permission to assign this role.', ephemeral: true }); }

        const desc = new EmbedBuilder()
        .setColor('#' + color)
        .setDescription(interaction.options.getString('desc'));
    
        let data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json')) : {};
        data[interaction.options.getString('desc')] = role.id;
        fs.writeFileSync('data.json', JSON.stringify(data));

        const click = new ButtonBuilder()
        .setCustomId('rr')
		.setLabel(button)
		.setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents( click );

        await interaction.channel.send({ embeds: [desc], components: [row] });

        interaction.reply({ content: 'Success!', ephemeral: true });
    }
}