const { createMsg } = require('../../../helper/builder.js');
const { restart } = require('../../logic/restart.js');

module.exports =
{
    name: 'restart',
    desc: 'Restarts and updates the bot',
    permissions: ['ManageGuild'],

    async execute(interaction) {

        await interaction.deferReply();

        try {
            await restart(interaction.client);
        }
        catch (error) {
            if (error.message.includes('\'pm2\' is not recognized as an internal or external command')) {
                return interaction.followUp({ embeds: [createMsg({ title: '**PM2 is not detected!**',
                    desc:
						'1. **npm install pm2**\n' +
						'2. **pm2 start start.js --name Eris**'
                })], ephemeral: true });
            }
            if (error.message.includes('Expected token to be set for this request, but none was present')) return;
        }

        await interaction.followUp(({ embeds: [createMsg({ desc: `**Successfully restarted ${interaction.client.user.username}!**` })] }));
    }
};
