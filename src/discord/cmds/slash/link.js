const { createSlash, createMsg, createError } = require('../../../helper/builder.js');
const { getEmoji, getPlayer, getDiscord, updateRoles } = require('../../../helper/utils.js');
const { Link } = require('../../../mongo/schemas.js');
const Errors = require('hypixel-api-reborn');

const notLinked = createError('**Discord is not linked!**');
const noMatch = createError('**Discord does not match!**');
const invalidIGN = createError('**Invalid Username!**');

module.exports = createSlash({
	name: 'link',
	desc: 'Link your account',
	options: [
		{ type: 'string', name: 'ign', desc: 'Enter your IGN', required: true }
	],
    
	async execute(interaction) 
	{
		await interaction.deferReply();

		const input = interaction.options.getString('ign');
		const check = await getEmoji('check');
		const plus = await getEmoji('plus');
		const minus = await getEmoji('minus');

		try
		{
			const player = await getPlayer(input);
			const discord = await getDiscord(player.uuid);
			if (!discord) 
				return interaction.followUp({ embeds: [notLinked] });
			if (interaction.user.username !== discord) 
				return interaction.followUp({ embeds: [noMatch] });

			await Link.create({ uuid: player.uuid, dcid: interaction.user.id })
				.catch((e) => { if (e.code === 11000) console.log('playersLinked: Duplicate Key!'); });

			await interaction.member.setNickname(player.nickname)
				.catch(e => {
					if (e.message.includes('Missing Permissions')) 
						interaction.followUp({embeds: [createMsg({ color: 'FF5B00', desc: '**I don\'t have permission to change your nickname!**' })] });
				});
	
			const { addedRoles, removedRoles } = await updateRoles(interaction, player);
	
			let desc;
			if (addedRoles.length > 0 && removedRoles.length > 0) 
			{
				desc = `${check} **Account linked!**\n_ _\n`;
				desc += `${addedRoles.map(roleID => `${plus} <@&${roleID}>`).join('\n')}\n_ _\n`;
				desc += `${removedRoles.map(roleID => `${minus} <@&${roleID}>`).join('\n')}`;
			} 
			else if (addedRoles.length > 0) 
			{
				desc = `${check} **Account linked!**\n_ _\n`;
				desc += `${addedRoles.map(roleID => `${plus} <@&${roleID}>`).join('\n')}\n_ _`;
			} 
			else if (removedRoles.length > 0) 
			{
				desc = `${check} **Account linked!**\n_ _\n`;
				desc += `${removedRoles.map(roleID => `${minus} <@&${roleID}>`).join('\n')}\n_ _`;
			} 
			else 
			{
				desc = `${check} **Account linked!**`;
			}
	
			return interaction.followUp({ embeds: [createMsg({ desc: desc })] });
		}
		catch (e)
		{
			if (e.message === Errors.PLAYER_DOES_NOT_EXIST) 
				return interaction.followUp({ embeds: [invalidIGN] });
			
			console.log(e); 
		}
	}
});