const { Errors } = require('hypixel-api-reborn');
const { createSlash, createMsg, createError } = require('../../../helper/builder.js');
const { getPlayer } = require('../../../helper/utils.js');
const { Link } = require('../../../mongo/schemas.js');

const invalidIGN = createError('**Invalid Username!**');

module.exports = createSlash({
	name: 'linkoverride',
	desc: 'Link Override',
	options: [
		{ type: 'user', name: 'discord', desc: 'Discord', required: true },
		{ type: 'string', name: 'ign', desc: 'IGN', required: true }
	],
	permissions: ['ManageRoles'],

	async execute(interaction) 
	{
		const user = interaction.options.getUser('discord');

		await interaction.deferReply();

		try
		{
			const player = await getPlayer(interaction.options.getString('ign'));

			const existingEntry = await Link.findOne({ $or: [{ uuid: player.uuid }, { dcid: user.id }] });

			if (existingEntry) 
			{
				await Link.updateOne({ _id: existingEntry._id }, { uuid: player.uuid, dcid: user.id });
			} 
			else 
			{
				await Link.create({ uuid: player.uuid, dcid: user.id });
			}

			return interaction.followUp({ embeds: [createMsg({ desc: `**Successfully linked ${user} to ${player.nickname}**` })] });
		}
		catch (e)
		{
			if (e.message === Errors.PLAYER_DOES_NOT_EXIST)
				return interaction.followUp({ embeds: [invalidIGN] });
			console.log(e); 
		}
	}
});