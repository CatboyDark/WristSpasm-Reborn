const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const app = require('../../../start.js');
const { createMsg } = require('../../helper/builder.js');
const axios = require('axios');
const { readConfig } = require('../../helper/utils.js');

const repoURL = 'https://api.github.com/repos/CatboyDark/WristSpasm-Reborn';

async function restart(client) {
    try {
        await execPromise('git update-index --skip-worktree README.md');
        await execPromise('git pull');

        await client.destroy();

        await app.init();
        await app.start();
    }
    catch (error) {
        console.error('Error during restart:', error);
        throw error;
    }
}

async function update(interaction) {
    const config = readConfig();
    await interaction.deferReply();

    try {
        const [latestHashResult, localHashResult] = await Promise.all([
            axios.get(`${repoURL}/commits/main`, { headers: { Accept: 'application/vnd.github.v3+json' } }),
            execPromise('git rev-parse --short HEAD')
        ]);

        const latestHash = latestHashResult.data.sha.substring(0, 7);
        const currentHash = localHashResult.stdout.trim();

        if (currentHash === latestHash) {
            return interaction.followUp({ embeds: [createMsg({ desc: `** ${interaction.client.user.username} is already up to date!**` })], ephemeral: true });
        }
    }
    catch (error) {
        console.error('Error checking for updates:', error);
        return interaction.followUp({ embeds: [createMsg({ title: config.guild, color: 'FF0000', desc: '**Error checking for updates!**' })] });
    }

    await restart(interaction.client);
    await interaction.followUp({ embeds: [createMsg({ color: '00FF00', desc: `**${interaction.client.user.username} has been updated!**` })] });
}

module.exports =
{
    restart,
    update
};
