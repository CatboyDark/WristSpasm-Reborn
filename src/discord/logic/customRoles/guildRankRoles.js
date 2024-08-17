const { createMsg, createRow, createModal } = require('../../../helper/builder.js');
const { readConfig, getGuild, toggleConfig } = require('../../../helper/utils');

async function getGuildRanks() {
	const config = readConfig();
	const guild = await getGuild('guild', config.guild);
	if (guild) {
		const guildRanks = guild.ranks.map(rank => rank.name);
		return guildRanks;
	}
	return [];
}

async function createGuildRankRolesMsg() {
	const guildRanks = await getGuildRanks();
	const roles = guildRanks.map((rank, index) => `${index + 1}. ${rank}`).join('\n');

	return createMsg({
		title: 'Custom Roles: Guild Ranks',
		desc: `Assign roles based on the user's rank in your guild.\n### Guild Ranks:\n${roles}`
	});
}

async function createButtons() {
	const guildRanks = await getGuildRanks();
	const config = readConfig();

	const buttons = guildRanks.map((rank, index) => {
		const id = `guildRank${index + 1}`;
		const style = config.features[`guildRank${index + 1}Toggle`] ? 'Green' : 'Red';
		return {
			id,
			label: rank,
			style
		};
	});

	return createRow(buttons);
}

function back() {
	const config = readConfig();
	const buttons = createRow([
		{ id: 'customRoles', label: 'Back', style: 'Gray' },
		{ id: 'guildRankRolesToggle', label: 'Enable Guild Rank Roles', style: config.features.guildRankRolesToggle }
	]);

	return buttons;
}

async function handleGuildRankToggle(interaction) {
	const rankNumber = interaction.customId.replace('guildRank', '');
	const featureToggleKey = `features.guildRank${rankNumber}Toggle`;

	// Check if the rank is not enabled and show the modal
	const config = readConfig();
	if (!config.features[`guildRank${rankNumber}Toggle`]) {
		const modal = createModal({
			id: `guildRank${rankNumber}Form`,
			title: `Set ${await getGuildRanks()[rankNumber - 1]}`,
			components: [{
				id: `guildRank${rankNumber}Input`,
				label: `ENTER ROLE ID FOR ${await getGuildRanks()[rankNumber - 1]}`,
				style: 'short',
				required: true
			}]
		});

		await interaction.showModal(modal);
	} else {
		await toggleConfig(featureToggleKey);
		await guildRankRoles(interaction);
	}
}

async function guildRankRolesToggle(interaction) {
	await toggleConfig('features.guildRankRolesToggle');
	await guildRankRoles(interaction);
}

async function guildRankRoles(interaction) {
	await interaction.update({ embeds: [await createGuildRankRolesMsg()], components: [await createButtons(), back()] });
}

module.exports = {
	guildRankRoles,
	handleGuildRankToggle,
	guildRankRolesToggle
};
