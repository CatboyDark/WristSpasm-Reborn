const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');

module.exports = {
	type: 'officer',
	command: 'd',

	async execute(bot, args) 
	{
		const ign = args[0];
		const player = await hypixel.getPlayer(ign);
		const discord = await player.socialMedia.find( (media) => media.id === 'DISCORD');

		send(bot, `/oc ${player}: @${discord.link}`);
	}
};
