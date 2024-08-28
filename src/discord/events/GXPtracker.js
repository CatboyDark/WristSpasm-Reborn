const cron = require('node-cron');
const { readConfig } = require('../../helper/utils.js');
const { logGXP } = require('../logic/GXP/logGXP.js');
const { createMsg } = require('../../helper/builder.js');
const { Events } = require('discord.js');

module.exports = 
[
	{
		name: Events.ClientReady,
		async execute(client) 
		{
			const config = readConfig();

			cron.schedule('1 22 * * *', async () => 
			{
				await logGXP();

				const eventsChannel = await client.channels.fetch(config.eventsChannel);
				await eventsChannel.send({ embeds: [createMsg({ title: config.guild, desc: '**Daily GXP database has been updated!**' })] });
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
	}
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