const { createSlash, createMsg } = require('../../../helper/builder');
const { readConfig } = require('../../../helper/utils');
const { getGXPList } = require('../../logic/GXP/fetchGXP');

const maxLength = 1024;

module.exports = createSlash({
	name: 'gxplist',
	desc: 'Displays GXP list',
	options: [
		{ type: 'string', name: 'threshold', desc: 'Filter members by GXP below this threshold (\'50000\' or \'50k\')' },
		{ type: 'integer', name: 'join_date', desc: 'Filter members who joined before a certain number of days ago' }
	],

	async execute(interaction) 
	{
		const thresholdInput = interaction.options.getString('threshold');
		const joinDateInput = interaction.options.getInteger('join_date');

		let threshold = null;
		let timeLimitDate = null;

		if (thresholdInput) 
		{
			const thresholdMatch = thresholdInput.match(/^(\d+)(k)?$/i);
			if (thresholdMatch) 
			{
				threshold = parseInt(thresholdMatch[1], 10);
				if (thresholdMatch[2]) threshold *= 1000;
			} 
			else 
			{
				return interaction.reply({ embeds: [createMsg({ desc: '**Invalid threshold.** Please provide a number (\'**50000**\' or \'**50k**\').' })], ephemeral: true });
			}
		}

		if (joinDateInput !== null) 
		{
			const currentDate = new Date();
			timeLimitDate = new Date(currentDate.setDate(currentDate.getDate() - joinDateInput));
		}

		await interaction.deferReply();

		const config = readConfig();
		const success = await interaction.followUp({ embeds: [createMsg({ title: 'WristSpasm', desc: '**Gathering data...**', icon: config.icon })] });

		let gxpList = await getGXPList();

		if (threshold !== null) 
		{
			gxpList = gxpList.filter(member => member.gxp < threshold);
		}

		if (timeLimitDate !== null) 
		{
			gxpList = gxpList.filter(member => new Date(member.joinDate) < timeLimitDate);
		}

		const chunks = [];
		for (let i = 0; i < gxpList.length; i += 50) 
		{
			chunks.push(gxpList.slice(i, i + 50));
		}

		await success.delete();

		for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) 
		{
			const chunk = chunks[chunkIndex];
			let ignList = '';
			let gxpList = '';

			for (const member of chunk) 
			{
				ignList += `${member.ign.replace(/_/g, '\\_')}\n`;
				gxpList += `${member.gxp}\n`;
			}

			const splitDescription = (text) => 
			{
				const parts = [];
				for (let i = 0; i < text.length; i += maxLength) 
				{
					parts.push(text.substring(i, i + maxLength));
				}
				return parts;
			};

			const ignListChunks = splitDescription(ignList);
			const gxpListChunks = splitDescription(gxpList);

			const fThreshold = threshold 
				? (threshold >= 1000 ? `${Math.floor(threshold / 1000)}k` : threshold.toString())
				: null;

			const joinDateLabel = joinDateInput !== null 
				? `Joined ${joinDateInput}+ Days Ago` 
				: null;

			const embedTitle = [
				'GXP List', 
				fThreshold ? `Below ${fThreshold}` : null, 
				joinDateLabel
			].filter(Boolean).join(' - ');

			for (let i = 0; i < ignListChunks.length; i++) 
			{
				const embed = createMsg({
					fields: [
						{ title: 'IGN', desc: ignListChunks[i], inline: true },
						{ title: 'GXP', desc: gxpListChunks[i], inline: true }
					],
					icon: config.icon,
					title: i === 0 && chunkIndex === 0 ? embedTitle : undefined
				});
				await interaction.channel.send({ embeds: [embed] });
			}
		}
	}
});