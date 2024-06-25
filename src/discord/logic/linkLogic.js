const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const { roles: { welcomeRole, linkedRole } } = require('../../../config.json');
const e = require('../../e.js');
const hypixel = require('../../contracts/hapi.js');

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

async function linkHelpMsg(interaction) 
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
	const success = new EmbedBuilder().setColor('00FF00').setDescription('<:gcheck:1244687091162415176> **Account linked!**');

	const member = interaction.guild.members.cache.get(interaction.user.id);
	const non = member.roles.cache.has(welcomeRole);

	const player = await hypixel.getPlayer(interaction.fields.getTextInputValue('linkI'));
	if (e.link(interaction, player)) return;
	const discord = player.socialMedia.find(media => media.id === 'DISCORD')?.link;

	await member.setNickname(player.nickname);

	member.roles.add(linkedRole);
	if (non) { member.roles.remove(welcomeRole); }

	if (e.match(interaction, discord)) {return;}

	const data = fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf8')) : {};
	const DataL = data.Linked || [];

	const entry = DataL.find(entry => entry.dcid === interaction.user.id);
	if (!entry)
	{ 			
		DataL.push
		({
			dcid: interaction.user.id,
			uuid: player.uuid,
			ign: player.nickname
		});
	}
	else if (entry.ign !== player.nickname) {
		entry.ign = player.nickname;
	}

	fs.writeFileSync('data.json', JSON.stringify(data, null, 4));

 	interaction.reply({ embeds: [success], ephemeral: true });
}

module.exports = { linkMsg, linkHelpMsg, linkLogic };
