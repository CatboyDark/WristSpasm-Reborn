const { readConfig, getGuild, getPlayer } = require('../../../helper/utils.js');
const { GXP, Inactivity } = require('../../../mongo/schemas.js');

async function getGXPList() 
{
	const config = readConfig();
	const guild = await getGuild('guild', config.guild);
        
	const fourteenDaysAgo = new Date();
	fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
	const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');

	const membersData = [];

	for (const member of guild.members) 
	{
		const { uuid, joinedAt } = member;
		const gxpData = await GXP.findOne({ uuid });

		if (gxpData) 
		{
			const recentEntries = gxpData.entries
				.filter(entry => entry.date >= fourteenDaysAgoStr);

			const totalGXP = recentEntries.reduce((sum, entry) => sum + entry.gxp, 0);
                
			const player = await getPlayer(uuid);

			membersData.push({ 
				uuid,
				ign: player.nickname,
				gxp: totalGXP,
				joinDate: member.joinedAt
			});
		}
	}

	membersData.sort((a, b) => b.gxp - a.gxp); 
	return membersData;
}

async function inactiveBelowReq() {
	const membersData = await getGXPList();
	return membersData.filter(member => member.gxp < 50000)
		.map(member => ({
			uuid: member.uuid,
			ign: member.ign,
			gxp: member.gxp
		}));
}

async function inactiveBelowReqWithinJoinDate() {
	const membersData = await getGXPList();

	const fourteenDaysAgo = new Date();
	fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
	const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');

	return membersData.filter(member => 
		member.gxp < 50000 &&
        member.joinDate >= fourteenDaysAgoStr
	).map(member => ({
		uuid: member.uuid,
		ign: member.ign,
		gxp: member.gxp,
		joinDate: member.joinDate
	}));
}

async function inactiveBelowReqWithinJoinDateWithInactivityRequest() 
{
	const membersData = await getGXPList();

	const fourteenDaysAgo = new Date();
	fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
	const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');

	const inactivityList = await Inactivity.find({}).exec();
	const inactivitySet = new Set(inactivityList.map(entry => entry.dcid));

	return membersData.filter(member => 
		member.gxp < 50000 &&
        member.joinDate >= fourteenDaysAgoStr &&
        inactivitySet.has(member.uuid)
	).map(member => ({
		uuid: member.uuid,
		ign: member.ign,
		gxp: member.gxp,
		joinDate: member.joinDate
	}));
}

module.exports = 
{ 
	getGXPList,
	inactiveBelowReq,
	inactiveBelowReqWithinJoinDate,
	inactiveBelowReqWithinJoinDateWithInactivityRequest
};
