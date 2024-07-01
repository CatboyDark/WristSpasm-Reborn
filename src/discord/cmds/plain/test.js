const hypixel = require('../../../contracts/hapi.js');

module.exports = {
    type: 'plain',
    name: 'asdf',

    async execute(message) {
        try {
            const player = await hypixel.getPlayer('puppyboydark');
            if (!player) {
                return message.channel.send('Player not found.');
            }

            message.channel.send(`Player UUID: ${player.uuid}`);

            const profiles = await hypixel.getSkyblockProfiles(player.uuid);
            if (!profiles || profiles.length === 0) {
                return message.channel.send('No SkyBlock profiles found.');
            }

            let highestLevel = 0;
            let bestProfile = null;

            for (const profile of profiles) {
                message.channel.send(`Profile ID: ${profile.profile_id}`);
                const level = profile.levels.total;
                if (level > highestLevel) {
                    highestLevel = level;
                    bestProfile = profile;
                }
            }

            if (bestProfile) {
                message.channel.send(
                    `puppyboydark's highest level is ${highestLevel} on profile ${bestProfile.profile_id}`,
                );
            } else {
                message.channel.send('No valid SkyBlock profiles found.');
            }
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while fetching data.');
        }
    },
};
