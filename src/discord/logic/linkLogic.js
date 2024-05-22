const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction) => 
{
    const linkM = new ModalBuilder()
    .setCustomId('linkM')
    .setTitle('Link your account!');

    const linkI = new TextInputBuilder()
    .setCustomId('linkI')
    .setMinLength(3)
    .setMaxLength(16)
    .setLabel('Enter your IGN:')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

    linkM.addComponents(new ActionRowBuilder().addComponents(linkI));

    await interaction.showModal(linkM);
}