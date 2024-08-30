const { getGuild, readConfig } = require('../../../helper/utils.js');
const { GXP } = require('../../../mongo/schemas.js');

function formatDate(date) 
{
	const [year, month, day] = date.split('-');
	return `${year}${month}${day}`;
}

function getToday() 
{
	const date = new Date();
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}${month}${day}`;
}

async function logGXP() 
{
	console.log('Attempting to log GXP...');
	try 
	{
		const config = readConfig();
		const guild = await getGuild('guild', config.guild);
		const today = getToday();

		for (const { uuid, expHistory } of guild.members) 
		{
			const entries = expHistory
				.filter(({ day }) => formatDate(day) !== today)
				.map(({ day, exp }) => ({
					date: formatDate(day),
					gxp: exp
				}));

			for (const entry of entries) 
			{
				const updateResult = await GXP.updateOne(
					{ uuid, 'entries.date': entry.date },
					{ $set: { 'entries.$.gxp': entry.gxp } }
				);

				if (!updateResult.matchedCount) 
				{
					await GXP.updateOne(
						{ uuid },
						{ $push: { entries: entry } },
						{ upsert: true }
					);
				}
			}
		}
	} 
	catch (error) 
	{
		console.error('Error logging GXP:', error);
	}
	console.log('Completed logging GXP!');
}

module.exports = { logGXP };