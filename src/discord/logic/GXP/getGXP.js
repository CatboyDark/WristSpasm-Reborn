const { readConfig, getGuild, getIGN } = require('../../../helper/utils.js');
const { GXP } = require('../../../mongo/schemas.js');

async function getGXP() {
    const config = readConfig();
    const guild = await getGuild('guild', config.guild);

    const date = new Date();
    date.setDate(date.getDate() - 14);
    const timeLimit = date.toISOString().slice(0, 10).replace(/-/g, '');

    const membersData = [];

    for (const member of guild.members) {
        const { uuid, joinedAt } = member;
        const gxpData = await GXP.findOne({ uuid });

        if (gxpData) {
            const recentEntries = gxpData.entries.filter(entry => entry.date >= timeLimit);
            const totalGXP = recentEntries.reduce((sum, entry) => sum + entry.gxp, 0);
            const user = await getIGN(uuid);
            membersData.push({
                uuid,
                ign: user,
                gxp: totalGXP,
                joinDate: joinedAt
            });
        }
    }

    membersData.sort((a, b) => b.gxp - a.gxp);
    return membersData;
}

module.exports =
{
    getGXP
};
