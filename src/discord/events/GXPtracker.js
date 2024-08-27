const cron = require('node-cron');
const { readConfig } = require('../../helper/utils.js');
const { logGXP } = require('../logic/GXP/logGXP.js');

module.exports = 
[
	{
		name: 'ready',
		async execute(client) 
		{
			const config = readConfig();

			cron.schedule('0 0 * * *', async () => 
			{
				await logGXP();
			}, 
			{
				timezone: 'America/Los_Angeles'
			});

			// if (config.features.purgeToggle)
			// {
			// 	cron.schedule('0 0 * * 6', () => 
			// 	{
			// 		toggleConfig('features.purgeWeek');
		
			// 		if (config.features.purgeWeek)
			// 		{
			// 			sendInactivityNotif(client);
			// 			sendStaffInactivityNotif(client);
			// 		}
			// 	},
			// 	{
			// 		timezone: 'America/Los_Angeles'
			// 	});
			// }
		}
	},
	// {
	// 	name: 'messageCreate',
	// 	async execute(message) 
	// 	{
	// 		if (message.content === '.test') 
	// 		{

	// 		}
	// 	}
	// }
];