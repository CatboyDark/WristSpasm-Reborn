const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');

module.exports = {
	type: 'officer',
	command: 'd',

	async execute(bot, args) 
	{
		try
		{
			const ign = args[0];
			const player = await hypixel.getPlayer(ign);
			const discord = await player.socialMedia.find((media) => media.id === 'DISCORD');

			if (!discord)
			{
				send(bot, '/oc Discord not linked.');
				return;
			}

			send(bot, `/oc ${player}: @${discord.link}`);
		}
		catch (e)
		{
			if (e.message.includes('Player does not exist'))
			{ send(bot, '/oc Invalid IGN.'); }
		}
	}
};
