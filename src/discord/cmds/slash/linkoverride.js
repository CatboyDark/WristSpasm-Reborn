const { Errors } = require('hypixel-api-reborn');
const { createMsg, createError } = require('../../../helper/builder.js');
const { getPlayer, updateRoles, getEmoji } = require('../../../helper/utils.js');
const { Link } = require('../../../mongo/schemas.js');

const invalidIGN = createError('**Invalid Username!**');

module.exports =
{
    name: 'linkoverride',
    desc: 'Link Override',
    options: [
        { type: 'user', name: 'discord', desc: 'Discord', required: true },
        { type: 'string', name: 'ign', desc: 'IGN', required: true }
    ],
    permissions: ['ManageRoles'],

    async execute(interaction) {
        const user = interaction.options.getUser('discord');
        const check = await getEmoji('check');
        const plus = await getEmoji('plus');
        const minus = await getEmoji('minus');

        await interaction.deferReply();

        try {
            const player = await getPlayer(interaction.options.getString('ign'));

            const existingEntry = await Link.findOne({ $or: [{ uuid: player.uuid }, { dcid: user.id }] });

            if (existingEntry) {
                await Link.updateOne({ _id: existingEntry._id }, { uuid: player.uuid, dcid: user.id });
            }
            else {
                await Link.create({ uuid: player.uuid, dcid: user.id });
            }

            const { addedRoles, removedRoles } = await updateRoles(interaction, player, true);

            let desc;
            if (addedRoles.length > 0 && removedRoles.length > 0) {
                desc = `${check} **Account linked!**\n_ _\n`;
                desc += `${addedRoles.map(roleID => `${plus} <@&${roleID}>`).join('\n')}\n_ _\n`;
                desc += `${removedRoles.map(roleID => `${minus} <@&${roleID}>`).join('\n')}`;
            }
            else if (addedRoles.length > 0) {
                desc = `${check} **Account linked!**\n_ _\n`;
                desc += `${addedRoles.map(roleID => `${plus} <@&${roleID}>`).join('\n')}\n_ _`;
            }
            else if (removedRoles.length > 0) {
                desc = `${check} **Account linked!**\n_ _\n`;
                desc += `${removedRoles.map(roleID => `${minus} <@&${roleID}>`).join('\n')}\n_ _`;
            }
            else {
                desc = `${check} **Account linked!**`;
            }

            await interaction.followUp({ embeds: [createMsg({ desc: `**Successfully linked ${user} to ${player.nickname}**` })] });
            await interaction.followUp({ embeds: [createMsg({ desc })] });
        }
        catch (e) {
            if (e.message === Errors.PLAYER_DOES_NOT_EXIST) return interaction.followUp({ embeds: [invalidIGN] });
            console.log(e);
        }
    }
};
