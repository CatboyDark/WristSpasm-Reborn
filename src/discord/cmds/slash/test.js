const { createSlash, createMsg } = require('../../../helper/builder');
const { getDiscord, getPlayer, getCataHighest, getSkills, getNw, getCata, getGuild, readConfig } = require('../../../helper/utils.js');
const { Link } = require('../../../mongo/schemas.js');
const hypixel = require('../../../helper/hapi.js');

module.exports = createSlash({
	name: 'test',
	desc: 'tests stuff',
	// options: [
	// 	{ type: 'string', name: 'user', desc: 'Enter a user', required: true }
	// ],

	async execute(interaction) 
	{
		interaction.reply('t');

		// const sbMember = await hypixel.getSkyblockMember(player.uuid);

		// for (const [profileName, profileData] of sbMember.entries()) 
		// {
		// 	console.log(await profileData.getNetworth());
		// }

		const config = readConfig();
		const guild = await getGuild('guild', config.guild);
		if (guild && guild.ranks && Array.isArray(guild.ranks)) 
		{
			const guildRanks = guild.ranks.map(rank => rank.name);
			console.log('Guild Ranks:', guildRanks);
		}

	}
});
