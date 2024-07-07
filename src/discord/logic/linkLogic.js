const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const { welcomeRole, welcomeRoleToggle, linkedRole } = require('../../../config.json');
const hypixel = require('../../contracts/hapi.js');
const { Errors } = require('hypixel-api-reborn');

const success = (interaction) =>
{
	const embed = new EmbedBuilder().setColor('00FF00').setDescription('<:gcheck:1244687091162415176> **Account linked!**');
	interaction.followUp({ embeds: [embed], ephemeral: true });
};

const invalidIGN = (interaction) => 
{
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Invalid Username!**');
	return interaction.followUp({ embeds: [embed], ephemeral: true });
};

const unLinked = (interaction) => 
{
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Discord is not linked!**\n_ _\nClick on How To Link for more info.');
	return interaction.followUp({ embeds: [embed], ephemeral: true });
};

const noMatch = (interaction) => 
{
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Discord does not match!**\n_ _\nClick on How To Link for more info.');
	return interaction.followUp({ embeds: [embed], ephemeral: true });
};

const noPerms = (interaction) => {
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Uhhhhhh Missing Perms!**');
	interaction.followUp({ embeds: [embed], ephemeral: true });
};

// Link Form

async function linkMsg(interaction) 
{
	const modal = new ModalBuilder()
		.setCustomId('linkM')
		.setTitle('Link Your Account')
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
	try 
	{
		await interaction.deferReply({ ephemeral: true });

		const input = interaction.fields.getTextInputValue('linkI');
		const player = await hypixel.getPlayer(input);
		const discord = await player.socialMedia.find(media => media.id === 'DISCORD');
		if (!discord) { return unLinked(interaction); }
		if (interaction.user.username !== discord.link) { return noMatch(interaction); };

		try { await interaction.member.setNickname(player.nickname); } catch (e) { if (e.message.includes('Missing Permissions')) { noPerms(interaction); console.log(e); } }
		await interaction.member.roles.add(linkedRole);

		if (welcomeRoleToggle) { if (interaction.user.roles.cache.has(welcomeRole)) { interaction.user.roles.remove(welcomeRole); } }

		// Datify

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

		return success(interaction);
	}
	catch (e)
	{
		if (e.message === Errors.PLAYER_DOES_NOT_EXIST) { return invalidIGN(interaction); }
	}
}

module.exports = { linkMsg, linkHelpMsg, linkLogic };
