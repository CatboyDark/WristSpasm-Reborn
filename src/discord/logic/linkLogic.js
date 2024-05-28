const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const hypixel = require('../../contracts/hapi');
const { gRole, welcomeRole, linkedRole } = require('../../../config.json');
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

// Link Help

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
            '5. Type your Discord username into chat.'
		)
		.setImage('https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif');

	await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Link Logic

async function linkLogic(interaction) 
{
	const invalidIGN = new EmbedBuilder().setColor('FF0000').setDescription('**Invalid IGN**');
	const noMatch = new EmbedBuilder().setColor('FF0000').setDescription('**Your Discord does not match!**');
	const alreadyLinked = new EmbedBuilder().setColor('FF0000').setDescription('**You are already linked!**');
	const match = new EmbedBuilder().setColor('00FF00').setDescription('<:gcheck:1244687091162415176> **Account linked!**');
    
	const ign = interaction.fields.getTextInputValue('linkI');
	let player;
	try {
		player = await hypixel.getPlayer(ign);
		if (!player) {
			await interaction.reply({ embeds: [invalidIGN], ephemeral: true });
			return;
		}} 
	catch (error) 
	{ 
		if (error.message.includes('Player does not exist.')) { 
			await interaction.reply({ embeds: [invalidIGN], ephemeral: true });
			return; } 
		else {
			console.error('Error fetching player:', error);
			await interaction.reply({ content: 'Unhandled error. Please ping staff.', ephemeral: true });
			return;
		}
	}

	const discord = player.socialMedia.find(media => media.id === 'DISCORD')?.link;
	const member = interaction.guild.members.cache.get(interaction.user.id);
	const gmember = member.roles.cache.has(gRole);
	const non = member.roles.cache.has(welcomeRole);

	if (interaction.user.tag === discord) 
	{
		const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
		data.Linked = data.Linked || [];

		if (data.Linked.find(entry => entry.dcid === interaction.user.id))
		{ interaction.reply({ embeds: [alreadyLinked], ephemeral: true }); return; }
		else 
		{
			member.setNickname(player.nickname).catch(e => console.error(`Failed to set nickname: ${e.message}`));
			if (non) { member.roles.remove(welcomeRole).catch(e => console.error(`Failed to remove Non: ${e.message}`)); }
			member.roles.add(linkedRole).catch(e => console.error(`Failed to add Linked: ${e.message}`));
			if (!gmember) { member.roles.add(gRole).catch(e => console.error(`Failed to add gMember: ${e.message}`)); }

			data.Linked.push({
				dcid: interaction.user.id,
				uuid: player.uuid,
				ign: player.nickname
			});

			fs.writeFileSync('data.json', JSON.stringify(data, null, 4));
			interaction.reply({ embeds: [match], ephemeral: true });
		}
	}
	else {
		interaction.reply({ embeds: [noMatch], ephemeral: true });
	}
}

module.exports = { linkMsg, linkHelp, linkLogic };
