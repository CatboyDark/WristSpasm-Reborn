const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');
const { Errors } = require('hypixel-api-reborn');

const unlinked = (bot) =>
{
	send(bot, '/oc No Discord found!');
	return;
};

module.exports =
{
	type: 'officer',
	command: 'd',

	async execute(bot, args) 
	{
		try
		{
			const ign = args[0];
			const player = await hypixel.getPlayer(ign);
			const discord = await player.socialMedia.find((media) => media.id === 'DISCORD');
			if (!discord) { unlinked(bot); }

			send(bot, `/oc @${discord.link}`);
		}
		catch (e)
		{
			if (e.message === Errors.PLAYER_DOES_NOT_EXIST)
			{ send(bot, '/oc Invalid Username!'); }
		}
	}
};
