const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => 
{
    const embed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('How to Link Your Account')
        .setDescription
        (
            '1. Connect to __mc.hypixel.net__.\n' +
            '2. Once you\'re in a lobby, click your on head (2nd hotbar slot).\n' +
            '3. Click **Social Media**.\n' +
            '4. Click **Discord**.\n' +
            '5. Type your Discord username into chat and hit enter.'
        )
        .setImage('https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif');

    await interaction.reply({ embeds: [embed], ephemeral: true });
}