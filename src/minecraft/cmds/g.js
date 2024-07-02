const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');

module.exports = {
	type: 'officer',
	command: 'g',

	async execute(bot, args) 
	{
		const player = await hypixel.getPlayer(args[0]);
		const guild = await hypixel.getGuild('player', player.uuid);
		const rank = await guild.members.find(member => member.uuid === player.uuid).rank;

		send(bot, `/oc ${player}: ${guild.name} [${rank}]`);
	}
};