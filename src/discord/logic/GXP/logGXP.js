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

			const member = await GXP.findOne({ uuid });

			if (member) 
			{
				for (const entry of entries) 
				{
					await GXP.updateOne(
						{ uuid, 'entries.date': entry.date },
						{ $set: { 'entries.$.gxp': entry.gxp } },
						{ upsert: true }
					);
				}

				const existingDates = member.entries.map(e => e.date);
				const newEntries = entries.filter(entry => !existingDates.includes(entry.date));

				if (newEntries.length > 0) 
				{
					await GXP.updateOne(
						{ uuid },
						{ $push: { entries: { $each: newEntries } } }
					);
				}
			} 
			else 
			{
				const newMember = new GXP({
					uuid,
					entries
				});

				await newMember.save();
			}
		}
	} 
	catch (error) 
	{
		console.error('Error logging GXP:', error);
	}
}


module.exports = { logGXP };