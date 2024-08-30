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

async function updateCheck(client) 
{
	const config = readConfig();

	try 
	{
		const [latestCommitResponse, localHashResult] = await Promise.all([
			axios.get(`${repoURL}/commits/main`, { headers: { 'Accept': 'application/vnd.github.v3+json' } }),
			execPromise('git rev-parse HEAD')
		]);

		const latestCommit = latestCommitResponse.data;
		const remoteHash = latestCommit.sha;
		const commitMsg = latestCommit.commit.message;
		const localHash = localHashResult.stdout.trim();

		const lastHash = config.lastHash || null;

		if (remoteHash !== localHash && remoteHash !== lastHash) 
		{
			config.lastHash = remoteHash;
			writeConfig(config);

			const channel = await client.channels.fetch(config.eventsChannel);
			channel.send({
				embeds: [createMsg({ title: 'Update available!', desc: `**Summary:**\n\`${commitMsg}\`` })],
				components: [updateButton]
			});
		} 
		else 
		{
			console.log(client.user.username + ' is up to date!');
		}
	} 
	catch (error) 
	{
		console.error('Error checking for updates:', error);
		const channel = await client.channels.fetch(config.eventsChannel); 
		channel.send({ embeds: [createMsg({ title: config.guild, desc: '**Error checking for updates!**' })] });
	}
}

module.exports = 
[
	{
		name: Events.ClientReady,
		async execute(client) 
		{
			await updateCheck(client);

			setInterval(async () => { 
				await updateCheck(client);
			}, 3600000);
		}
	}
];
