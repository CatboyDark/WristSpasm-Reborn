const { readConfig, getGuild, getIGN } = require('../../../helper/utils.js');
const { GXP, Inactivity } = require('../../../mongo/schemas.js');

async function getGXP(client) {
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
            const user = await getIGN(client, uuid);
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

async function getPurge(client) {
    const membersData = await getGXP(client);
    const inactivityRequests = await Inactivity.find({});
    const inactivityList = new Set(inactivityRequests.map(entry => entry.dcid));

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const fMembers = membersData.filter(member => {
        const missingGXP = member.gxp < 100000;
        const joinedDate = new Date(member.joinDate);
        const expiredJoinDate = joinedDate < twoWeeksAgo;
        const unexcused = !inactivityList.has(member.uuid);

        return missingGXP && expiredJoinDate && unexcused;
    });

    return fMembers;
}

module.exports = { getGXP, getPurge };
