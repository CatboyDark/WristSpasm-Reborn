const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const countCheck = (interaction, count) => 
{
	const posNum = new EmbedBuilder().setColor('FF0000').setDescription('**You must purge at least one message!**');
	const msgLimit = new EmbedBuilder().setColor('FF0000').setDescription('**You can only purge up to 100 messages!**');

	if (count < 1) { interaction.reply({ embeds: [posNum], ephemeral: true }); return true; }
	if (count > 100) { interaction.reply({ embeds: [msgLimit], ephemeral: true }); return true; }
	return false;
};

const ageCheck = (interaction) =>
{
	const ageLimit = new EmbedBuilder().setColor('FF0000').setDescription('**You cannot purge messages older than 14 days!**');
	return error => { if (error.code === 50034) { interaction.reply({ embeds: [ageLimit], ephemeral: true}); }};
};

module.exports = 
{
	type: 'slash',
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

		if (countCheck(interaction, count)) return;
		let msg = await interaction.channel.messages.fetch({ limit: count });

		let success;
		if (msg.size === 1) { success = new EmbedBuilder().setColor('00FF00').setDescription('**Deleted a message.**'); }
		else 
		{ 
			const f = filter === 'user' ? 'user' : (filter === 'bot' ? 'bot' : '');
			success = new EmbedBuilder().setColor('00FF00').setDescription(`**Deleted ${msg.size} ${f} messages.**`);
		}

		if (filter === 'user') { msg = msg.filter(msg => !msg.author.bot); } 
		if (filter === 'bot') { msg = msg.filter(msg => msg.author.bot);}

		await interaction.channel.bulkDelete(msg)
			.then(() => interaction.reply({ embeds: [success], ephemeral: true }))
			.catch(ageCheck(interaction));
	}
};
