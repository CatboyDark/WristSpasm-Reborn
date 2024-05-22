const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

// Link Form

async function linkMsg(interaction)
{
    const modal = new ModalBuilder()
        .setCustomId('linkM')
        .setTitle('Link your account!');

    const input = new TextInputBuilder()
        .setCustomId('linkI')
        .setMinLength(3)
        .setMaxLength(16)
        .setLabel('Enter your IGN:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    await interaction.showModal(modal);
}

// Link Help Message

async function linkHelp(interaction)
{
    const embed = new EmbedBuilder()
        .setColor('#0000FF')
        .setTitle('How to Link Your Account')
        .setDescription(
            '1. Connect to __mc.hypixel.net__.\n' +
            '2. Once you\'re in a lobby, click your on head (2nd hotbar slot).\n' +
            '3. Click **Social Media**.\n' +
            '4. Click **Discord**.\n' +
            '5. Type your Discord username into chat and hit enter.'
        )
        .setImage('https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif');

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Link Logic

async function linkLogic(interaction)
{
    await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
}

module.exports = { linkMsg, linkHelp, linkLogic };