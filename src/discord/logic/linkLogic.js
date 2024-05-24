const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const hypixelRebornAPI = require('../../contracts/HAPI');
const { gmemberRole, welcomeRole } = require('../../../config.json');
const fs = require('fs');

// Link Form

async function linkMsg(interaction) 
{
	const modal = new ModalBuilder()
		.setCustomId('linkM')
		.setTitle('Link your account!')
		.addComponents(new ActionRowBuilder().addComponents(
			new TextInputBuilder()
				.setCustomId('linkI')
				.setLabel('Enter your IGN:')
				.setMinLength(3)
				.setMaxLength(16)
				.setStyle(TextInputStyle.Short)
				.setRequired(true)));

	await interaction.showModal(modal);
}

// Link Help Message

async function linkHelp(interaction) 
{
	const embed = new EmbedBuilder()
		.setColor('03A9F4')
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
	const match = new EmbedBuilder().setColor('00FF00').setDescription('**Account linked!**');
	const noMatch = new EmbedBuilder().setColor('FF0000').setDescription('**Your Discord does not match!**');
    
	const ign = interaction.fields.getTextInputValue('linkI');
	const player = await hypixelRebornAPI.getPlayer(ign);

	const discord = player.socialMedia.find(media => media.id === 'DISCORD')?.link;
	const member = interaction.guild.members.cache.get(interaction.user.id);
	const gmember = member.roles.cache.has(gmemberRole);
	const non = member.roles.cache.has(welcomeRole);

	if (interaction.user.tag === discord) 
	{
		member.setNickname(player.nickname).catch(e => console.error(`Failed to set nickname: ${e.message}`));
		if (!gmember) { member.roles.add(gmemberRole).catch(e => console.error(`Failed to add role: ${e.message}`)); }
		if (non) { member.roles.remove(welcomeRole).catch(e => console.error(`Failed to remove role: ${e.message}`)); }

		// Datify

		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
		const linked = data['Linked'] || {};
		linked[interaction.user.id] = player.nickname;
		data['Linked'] = linked;
		const formattedData = JSON.stringify(data, null, 4);
		fs.writeFileSync('data.json', formattedData);
		interaction.reply({ embeds: [match], ephemeral: true });
	}
	else {
		interaction.reply({ embeds: [noMatch], ephemeral: true });
	}
}

module.exports = { linkMsg, linkHelp, linkLogic };