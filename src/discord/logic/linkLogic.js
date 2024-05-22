const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const hypixelRebornAPI = require("../../contracts/HAPI");
const { gmemberRole, welcomeRole } = require('../../../config.json');

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
        .setColor('#03A9F4')
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
    const ign = interaction.fields.getTextInputValue('linkI')
    hypixelRebornAPI.getPlayer(ign).then((player) => 
    {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const discord = player.socialMedia.find((media) => media.id === "DISCORD")?.link;
        const gmember = member.roles.cache.has(gmemberRole)
        const non = member.roles.cache.has(welcomeRole)

        if (interaction.user.tag === discord) {
            member.setNickname(player.nickname);
            if (!gmember) { member.roles.add(gmemberRole); } 
            if (non) { member.roles.remove(welcomeRole); }
            interaction.reply({ content: `everything works!`, ephemeral: true });
        } else {
            console.log(`Discord ${interaction.user.tag} =/= IGN ${discord}`);
            interaction.reply({ content: `Your Discord does not match.`, ephemeral: true });
        }
    })
    .catch((e) => {
        { console.error(e); }
    });
}

module.exports = { linkMsg, linkHelp, linkLogic };