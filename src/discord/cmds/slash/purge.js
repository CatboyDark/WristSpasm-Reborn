const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge messages')
		.addIntegerOption(option => option.setName('count').setDescription('Number of messages').setRequired(true))
		.addBooleanOption(option => option.setName('bots').setDescription('Only purge bot messages').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) 
	{
		const count = interaction.options.getInteger('count');
		const msgs = await interaction.channel.messages.fetch({ limit: count });
		const botMsgs = msgs.filter(msg => msg.author.bot);

		const purgeLimit = new EmbedBuilder().setColor('FF0000').setDescription('**You can only purge up to 100 messages.**');
		const purgeSuccess = new EmbedBuilder().setColor('00FF00').setDescription(`**Deleted ${count} messages.**`);
		const botPurgeSuccess = new EmbedBuilder().setColor('00FF00').setDescription(`**Deleted ${count} bot messages.**`);

		if (count > 100) { await interaction.reply({ embeds: [purgeLimit], ephemeral: true }); }

		if (!interaction.options.getBoolean('bots'))
		{   
			await interaction.channel.bulkDelete(msgs);
			await interaction.reply({ embeds: [purgeSuccess], ephemeral: true });
		} 
		else {
			await interaction.channel.bulkDelete(botMsgs);
			await interaction.reply({ embeds: [botPurgeSuccess], ephemeral: true });
		}
	}
};
