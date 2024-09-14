const { createMsg } = require('../../../helper/builder.js');
const { restart } = require('../../logic/restart.js');

module.exports =
{
    name: 'restart',
    desc: 'Restarts and updates the bot',
    permissions: ['ManageGuild'],

    async execute(interaction) {
        await interaction.deferReply();

        await restart(interaction.client);

        await interaction.followUp(({ embeds: [createMsg({ color: '00FF00', desc: `**Successfully restarted ${interaction.client.user.username}!**` })] }));
    }
};
