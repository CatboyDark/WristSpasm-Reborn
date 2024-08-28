const { getGuild, readConfig } = require('../../../helper/utils.js');
const { GXP } = require('../../../mongo/schemas.js');

const formatDate = (dateStr) => 
{
	const [year, month, day] = dateStr.split('-');
	return `${year.slice(2)}${month}${day}`;
};

async function logGXP() 
{
	const config = readConfig();
	const guild = await getGuild('guild', config.guild);

	for (const { uuid, expHistory } of guild.members) 
	{
		const gxpEntries = expHistory.map(({ day, exp }) => ({
			date: formatDate(day),
			gxp: exp
		}));

		const member = await GXP.findOne({ uuid });

		if (member) 
		{
			const updatedEntries = [...gxpEntries, ...member.entries];
			await GXP.findOneAndUpdate({ uuid }, { entries: updatedEntries }, { new: true });
		} 
		else 
		{
			await GXP.create({ uuid, entries: gxpEntries });
		}
	}
}

module.exports = { logGXP };