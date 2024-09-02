const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function restart(client) {
    try {
        await execPromise('git update-index --skip-worktree README.md');
        await execPromise('git pull');

        await client.destroy();
        await execPromise('pm2 restart Eris');
    }
    catch (error) {
        console.error('Error during restart:', error);
        throw error;
    }
}

async function update(interaction) {
    await interaction.deferReply();
    await restart(interaction.client);
    await interaction.followUp(`**${interaction.client.user.username} has been updated!**`);
}

module.exports =
{
    restart,
    update
};
