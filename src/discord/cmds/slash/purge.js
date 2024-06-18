const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const e = require('../../../e.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge messages')
		.addIntegerOption(option => option.setName('count').setDescription('Number of messages').setRequired(true))
		.addStringOption(option => option.setName('filter').setDescription('User OR bot messages').addChoices(
			{ name: 'Bot Messages', value: 'bot'},
			{ name: 'User Messages', value: 'user'})
			.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) 
	{
		const filter = interaction.options.getString('filter');
		const count = interaction.options.getInteger('count');

		if (e.countCheck(interaction, count)) return;
		let msg = await interaction.channel.messages.fetch({ limit: count });

		let success;
		if (msg.size === 1) { success = new EmbedBuilder().setColor('00FF00').setDescription('**Deleted a message.**'); }
		else { 
			const f = filter === 'user' ? 'user' : (filter === 'bot' ? 'bot' : '');
			success = new EmbedBuilder().setColor('00FF00').setDescription(`**Deleted ${msg.size} ${f} messages.**`);
		}

		if (filter === 'user') { msg = msg.filter(msg => !msg.author.bot); } 
		if (filter === 'bot') { msg = msg.filter(msg => msg.author.bot);}

		await interaction.channel.bulkDelete(msg)
			.then(() => interaction.reply({ embeds: [success], ephemeral: true }))
			.catch(e.ageCheck(interaction));
	}
};
