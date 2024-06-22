const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports =
{
	data: new SlashCommandBuilder()
		.setName('sservers')
		.setDescription('Setup Discords Channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		const success = new EmbedBuilder().setColor('00FF00').setDescription('**Success!**');

		const general = new EmbedBuilder()
			.setColor('641C34')
			.setDescription('**General Carries and Services:**');

		const mods = new EmbedBuilder()
			.setColor('3B83BD')
			.setDescription('**Mods:**');
        
		const mining = new EmbedBuilder()
			.setColor('8E402A')
			.setDescription('**Mining:**');

		const farming = new EmbedBuilder()
			.setColor('0E294B')
			.setDescription('**Farming:**');

		const rGeneral = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('sbz').setLabel('SBZ').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('sbm').setLabel('SBM').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('cow').setLabel('Cowshed').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('exocafe').setLabel('Exotic Cafe').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('skyhelper').setLabel('SkyHelper').setStyle(ButtonStyle.Success)
		);

		const rGeneral2 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('ims').setLabel('Ironman Sweats').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('bingob').setLabel('Bingo Brewers').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('kuudra').setLabel('Kuudra Gang').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('hunters').setLabel('Official Hunters').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('dsg').setLabel('Dungeon Secrets Guide').setStyle(ButtonStyle.Success)
		);

		const rMods = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('patcher').setLabel('Patcher').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('skyclient').setLabel('Skyclient').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('sba').setLabel('Skyblock Addons').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('st').setLabel('Skytils').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('neu').setLabel('NEU').setStyle(ButtonStyle.Success)
		);

		const rMods2 =new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('ct').setLabel('ChatTriggers').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('soopy').setLabel('SoopyAddons').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('drm').setLabel('Dungeon Rooms Mod').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('dulkir').setLabel('Dulkir').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('sh').setLabel('Skyhanni').setStyle(ButtonStyle.Success)
		);

		const rMods3 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('sbe').setLabel('SBE').setStyle(ButtonStyle.Success)
		);

		const rMining = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('cult').setLabel('Mining Cult').setStyle(ButtonStyle.Success),
		);

		const rFarming = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('fcouncil').setLabel('Farming Council').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId('elitef').setLabel('Elite Skyblock Farmers').setStyle(ButtonStyle.Success)
		);

		await interaction.channel.send({ embeds: [general], components: [rGeneral, rGeneral2] });
		await interaction.channel.send({ embeds: [mods], components: [rMods, rMods2, rMods3] });
		await interaction.channel.send({ embeds: [mining], components: [rMining] });
		await interaction.channel.send({ embeds: [farming], components: [rFarming] });

		await interaction.reply({ embeds: [success], ephemeral: true });
	}
};