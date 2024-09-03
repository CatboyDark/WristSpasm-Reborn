const { Events } = require('discord.js');
const { exec } = require('child_process');
const util = require('util');
const { readConfig, writeConfig } = require('../../helper/utils.js');
const { createMsg, createRow } = require('../../helper/builder.js');
const axios = require('axios');
const execPromise = util.promisify(exec);

const repoURL = 'https://api.github.com/repos/CatboyDark/Eris';
const updateButton = createRow([
    { id: 'update', label: 'Update', style: 'Green' }
]);

async function updateCheck(client) {
    const config = readConfig();
    const channel = await client.channels.fetch(config.logsChannel);

    try {
        const [latestHashResult, localHashResult] = await Promise.all([
            axios.get(`${repoURL}/commits/main`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
            execPromise('git rev-parse HEAD')
        ]);

        const latestHash = latestHashResult.data.sha;
        const currentHash = localHashResult.stdout.trim();
        const commitMsg = latestHashResult.data.commit.message;

        if (currentHash !== latestHash) {
            console.warn(`${client.user.username}: Update Available! Run "git pull" to update!`);
        }

        if (config.latestHash !== latestHash) {
            await channel.send({
                embeds: [createMsg({ title: 'Update available!', desc: `**Summary:**\n\`${commitMsg}\`` })],
                components: [updateButton]
            });
            config.latestHash = latestHash;
            writeConfig(config);
        }
    }
    catch (error) {
        console.error('Error checking for updates:', error);
        await channel.send({ embeds: [createMsg({ title: config.guild, desc: '**Error checking for updates!**' })] });
    }
}

module.exports = [{
    name: Events.ClientReady,
    async execute(client) {
        await updateCheck(client);
        setInterval(async() => {
            await updateCheck(client);
        }, 3600000);
    }
}];
