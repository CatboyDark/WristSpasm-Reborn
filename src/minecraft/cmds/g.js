const hypixel = require('../../contracts/hapi.js');
const { send } = require('../chat.js');
const { Errors } = require('hypixel-api-reborn');

const guildless = (bot, player) =>
{
	send(bot, `/oc ${player} is not in a guild!`);
	return;
};

function getTime(timestamp)
{
	const joinedDate = new Date(timestamp);
	const currentDate = new Date();
    
	const years = currentDate.getFullYear() - joinedDate.getFullYear();
	const months = currentDate.getMonth() - joinedDate.getMonth();
	const days = currentDate.getDate() - joinedDate.getDate();

	let totalMonths = years * 12 + months;
	if (days > 0) totalMonths++;

	if (totalMonths < 1) { return `${days} day${days !== 1 ? 's' : ''} ago`; }
	else if (totalMonths < 12) {
		const formattedMonths = totalMonths % 1 === 0 ? totalMonths.toFixed(0) : totalMonths.toFixed(1);
		return `${formattedMonths} month${totalMonths !== 1 ? 's' : ''} ago`;
	}
	else {
		const formattedYears = (years + months / 12).toFixed(1);
		return `${formattedYears} year${years + months / 12 !== 1 ? 's' : ''} ago`;
	}
}

function getWGXP(wGXP)
{
	if (wGXP >= 1000)
	{
		const formatted = wGXP / 1000;
		return `${formatted.toFixed(0)}k`;
	}
	else { return `${wGXP}`; }
}

module.exports =
{
	type: 'officer',
	command: 'g',

	async execute(bot, args) 
	{
		try
		{
			const player = await hypixel.getPlayer(args[0]);
			const guild = await hypixel.getGuild('player', player.uuid);

			if (!guild) { guildless(bot, player); }
			
			const rankName = await guild.me.rank;
			const rankRank = await guild.ranks.find(rank => rank.name === rankName).priority;
			const joinDate = await guild.me.joinedAtTimestamp;
			const wGXP = await guild.me.weeklyExperience;

			send(bot, `/oc ${guild.name}`);

			if (args[1] === 'e')
			{
				setTimeout(() => { send(bot, `/oc [${rankName}] (${rankRank}) Weekly GXP: ${getWGXP(wGXP)}. Joined: ${getTime(joinDate)}.`); }, 500);
				setTimeout(() => { send(bot, `/oc Guild Level: ${Math.floor(guild.level)}. Members: ${guild.members.length}.`); }, 1000);
			}
		}
		catch (e)
		{
			if (e.message === Errors.PLAYER_DOES_NOT_EXIST)
			{ send(bot, '/oc Invalid Username!'); }
		}
	}
};

