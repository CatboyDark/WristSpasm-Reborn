const { Errors } = require('hypixel-api-reborn');
const { getPlayer } = require('../../../helper/utils');
const { createError, createMsg } = require('../../../helper/builder');
const { Inactivity } = require('../../../mongo/schemas');

const invalidIGN = createError('**Invalid Username!**');
const alreadyExcused = createError('**This player has already been excused!**');

module.exports =
{
    name: 'inactivityoverride',
    desc: 'Inactivity Override',
    options: [
        { type: 'string', name: 'ign', desc: 'IGN', required: true },
        { type: 'string', name: 'reason', desc: 'Reason' }
    ],
    permissions: ['ManageRoles'],

    async execute(interaction) {
        const ign = interaction.options.getString('ign');
        const reason = interaction.options.getString('reason');

        try {
            const player = await getPlayer(ign);
            const uuid = player.uuid;

            const existingEntry = await Inactivity.findOne({ dcid: uuid });
            if (existingEntry) {
                return interaction.reply({ embeds: [alreadyExcused], ephemeral: true });
            }

            const newEntry = new Inactivity({
                dcid: uuid,
                reason
            });

            await newEntry.save();

            return interaction.reply({ embeds: [createMsg({ desc: `${ign} is now excused for the upcoming purge!` })], ephemeral: true });
        }
        catch (e) {
            if (e.message === Errors.PLAYER_DOES_NOT_EXIST) return interaction.followUp({ embeds: [invalidIGN] });

            console.log(e);
        }
    }
};
