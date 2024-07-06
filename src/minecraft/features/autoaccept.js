// const { autoAcceptReq, autoAcceptToggle } = require('../../../config.json');
// const hypixel = require('../../contracts/hapi.js');

// const { send } = require('../chat.js');

// module.exports = (bot) => 
// {
// 	bot.on('message', (message) => 
// 	{
// 		if (!autoAcceptToggle) { return; }

// 		let text = message.toString().trim();

// 		// Check if the message contains a colon
// 		if (text.includes(':')) 
// 		{
// 			return; // Ignore the message
// 		}

// 		// Check if the message contains 'has requested to join the Guild!'
// 		const joinRequestPattern =
//             /(.*)\s(?:\[[^\]]+\]\s)?([^\s]+) has requested to join the Guild!/;
// 		text = text.match(joinRequestPattern);

// 		if (text) 
// 		{
// 			const player = hypixel.getPlayer('player', text[2]);
// 			const profiles = hypixel.getSkyblockProfiles(player.uuid);
// 			console.log(profiles);

// 			let highestLevel = 0;

// 			for (const profile of profiles) 
// 			{
// 				const level = profile.levels.total;

// 				if (level > highestLevel) 
// 				{
// 					highestLevel = level;
// 				}
// 			}

// 			if (highestLevel >= autoAcceptReq)
// 			{ send(bot, `/g accept ${player}`); }
// 			else { send(bot, `/oc ${player} does not meet requirements. (${highestLevel}) `); }
// 		}
// 	});
// };
