const { Link } = require('../../../mongo/schemas.js');
const Errors = require('hypixel-api-reborn');
const { createMsg, createRow, createModal, createError } = require('../../../helper/builder.js');
const { getEmoji, getDiscord, getPlayer, updateRoles } = require('../../../helper/utils.js');

const notLinked = createError('**Discord is not linked!**\n_ _\nClick on **How To Link** for more info.');
const noMatch = createError('**Discord does not match!**\n_ _\nClick on **How To Link** for more info.');
const invalidIGN = createError('**Invalid Username!**');

async function createLinkMsg() 
{
	const check = await getEmoji('check');

	const linkMsg = createMsg({
		desc:
            `### ${check} Link your Account!\n` +
            'Enter your IGN to connect your Hypixel account.\n\n' +

            '*Please contact a staff member if the bot is down or if you require further assistance.*'
	});

	return linkMsg;
}

const linkHelpMsg = createMsg({
	title: 'How to Link Your Account',
	desc:
		'1. Connect to __mc.hypixel.net__.\n' +
		'2. Once you\'re in a lobby, click on your head (2nd hotbar slot).\n' +
		'3. Click **Social Media**.\n' +
		'4. Click **Discord**.\n' +
		'5. Type your Discord username into chat.',
	image: 'https://media.discordapp.net/attachments/922202066653417512/1066476136953036800/tutorial.gif'
});

const linkButtons = createRow([
	{ id: 'link', label: 'Link', style: 'Green' },
	{ id: 'linkHelp', label: 'How To Link', style: 'Gray' }
]);

const modal = createModal({
	id: 'linkForm',
	title: 'Link Your Account',
	components: [{
		id: 'linkInput',
		label: 'ENTER YOUR IGN:',
		style: 'short',
		required: true,
		length: [3, 16]
	}]
});

async function link(interaction) 
{
	if (!interaction.isModalSubmit()) return interaction.showModal(modal);

	const check = await getEmoji('check');
	const plus = await getEmoji('plus');
	const minus = await getEmoji('minus');

	await interaction.deferReply({ ephemeral: true });

	const input = interaction.fields.getTextInputValue('linkInput');

	try
	{
		const player = await getPlayer(input);
		const discord = await getDiscord(input);
		if (!discord) 
			return interaction.followUp({ embeds: [notLinked] });
		if (interaction.user.username !== discord) 
			return interaction.followUp({ embeds: [noMatch] });

		await Link.create({ uuid: player.uuid, dcid: interaction.user.id }).catch(() => {});

		await interaction.member.setNickname(player.nickname)
			.catch(e => {
				if (e.message.includes('Missing Permissions')) 
					interaction.followUp({embeds: [createMsg({ color: 'FFD800', desc: '**I don\'t have permission to change your nickname!**' })] });
			});

		const { addedRoles, removedRoles } = await updateRoles(interaction, player, true);

		let desc;
		if (addedRoles.length > 0 && removedRoles.length > 0) 
		{
			desc = `${check} **Account linked!**\n_ _\n`;
			desc += `${addedRoles.map(roleId => `${plus} <@&${roleId}>`).join('\n')}\n_ _\n`;
			desc += `${removedRoles.map(roleId => `${minus} <@&${roleId}>`).join('\n')}`;
		} 
		else if (addedRoles.length > 0) 
		{
			desc = `${check} **Account linked!**\n_ _\n`;
			desc += `${addedRoles.map(roleId => `${plus} <@&${roleId}>`).join('\n')}\n_ _`;
		} 
		else if (removedRoles.length > 0) 
		{
			desc = `${check} **Account linked!**\n_ _\n`;
			desc += `${removedRoles.map(roleId => `${minus} <@&${roleId}>`).join('\n')}\n_ _`;
		} 
		else 
		{
			desc = `${check} **Account linked!**`;
		}

		return interaction.followUp({ embeds: [createMsg({ desc: desc })], ephemeral: true });
	} 
	catch (e)
	{
		if (e.message === Errors.PLAYER_DOES_NOT_EXIST)
			return interaction.followUp({ embeds: [invalidIGN] });
		console.log(e); 
	}
}

async function linkHelp(interaction)
{
	await interaction.reply({ embeds: [linkHelpMsg], ephemeral: true });
}

module.exports = 
{
	createLinkMsg,
	linkButtons,
	link,
	linkHelp
};