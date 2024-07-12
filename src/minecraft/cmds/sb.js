const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');
const { Errors } = require('hypixel-api-reborn');

module.exports = 
{
	type: 'officer',
	command: 'sb',

	async execute(bot, args, client)
	{
		try
		{
			send(bot, '/oc hmmmm');

			const channelId = '1260569815479877702';
			const channel = client.channels.cache.get(channelId);

			const player = await hypixel.getPlayer(args[0]);
			const sbMember = await hypixel.getSkyblockMember(`${player.uuid}`);
			const selected = sbMember.selected;

			channel.send(`Player: ${player.nickname}`);
			channel.send(`Skyblock Member: ${sbMember.selected}`);
			channel.send(`Selected Profile: ${selected}`);

			send(bot, `/oc ${player.displayName}'s selected profile: ${selected}`);
		}
		catch (e) 
		{
			console.log(e);
			if (e.message === Errors.PLAYER_DOES_NOT_EXIST)
			{ send(bot, '/oc Invalid Username!'); }
		}
	}
};
