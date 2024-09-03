const cron = require('node-cron');
const { readConfig, toggleConfig } = require('../../helper/utils.js');
const { logGXP } = require('../logic/GXP/logGXP.js');
const { createMsg } = require('../../helper/builder.js');
const { Events } = require('discord.js');
const { sendStaffInactivityNotif, sendInactivityNotif } = require('../logic/GXP/inactivityNotif.js');

module.exports =
[{
    name: Events.ClientReady,
    async execute(client) {
        const config = readConfig();

        cron.schedule('1 22 * * *', async() => { // 00:01 PST every day
            await logGXP();

            const channel = await client.channels.fetch(config.logsChannel);
            await channel.send({ embeds: [createMsg({ title: config.guild, desc: '**Daily GXP database has been updated!**' })] });
        },
        {
            timezone: 'America/Los_Angeles'
        });

        if (config.features.purgeToggle) {
            cron.schedule('0 0 * * 6', async() => { // 00:00 PST every Saturday
                if (config.features.purgeWeek) {
                    await sendInactivityNotif(client);
                    await sendStaffInactivityNotif(client);
                }
                toggleConfig('features.purgeWeek');
            },
            {
                timezone: 'America/Los_Angeles'
            });
        }
    }
}];
