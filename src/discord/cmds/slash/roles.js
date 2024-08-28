const { createMsg, createSlash, createError } = require('../../../helper/builder.js');
const { Link } = require('../../../mongo/schemas.js');
const { getEmoji, getPlayer, updateRoles } = require('../../../helper/utils.js');

const notLinked = createError('**You are not linked! Please run /link to link your account!**');

module.exports = createSlash({
	name: 'roles',
	desc: 'Update your roles',

	async execute(interaction) 
	{
		await interaction.deferReply();

		const user = interaction.user.id;
		const plus = await getEmoji('plus');
		const minus = await getEmoji('minus');

		try 
		{
			const data = await Link.findOne({ dcid: user }).exec();
			if (!data) 
			{
				return interaction.followUp({ embeds: [notLinked], ephemeral: true });
			}
			const uuid = data.uuid;
			const player = await getPlayer(uuid);

			try 
			{
				await interaction.member.setNickname(player.nickname);
			} 
			catch (e) 
			{
				if (e.message.includes('Missing Permissions')) 
					interaction.followUp({embeds: [createMsg({ color: 'FFD800', desc: '**I don\'t have permission to change your nickname!**' })] });
			}

			const { addedRoles, removedRoles } = await updateRoles(interaction, player);

			let desc;
			if (addedRoles.length > 0 && removedRoles.length > 0) 
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${addedRoles.map(roleId => `${plus} <@&${roleId}>`).join('\n')}\n_ _\n`;
				desc += `${removedRoles.map(roleId => `${minus} <@&${roleId}>`).join('\n')}`;
			} 
			else if (addedRoles.length > 0) 
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${addedRoles.map(roleId => `${plus} <@&${roleId}>`).join('\n')}\n_ _`;
			} 
			else if (removedRoles.length > 0) 
			{
				desc = '**Your roles have been updated!**\n_ _\n';
				desc += `${removedRoles.map(roleId => `${minus} <@&${roleId}>`).join('\n')}\n_ _`;
			} 
			else 
			{
				desc = '**Your roles are up to date!**';
			}

			return interaction.followUp({ embeds: [createMsg({ desc: desc })] });
		} 
		catch (error) 
		{
			throw error;
		}
	}
});
