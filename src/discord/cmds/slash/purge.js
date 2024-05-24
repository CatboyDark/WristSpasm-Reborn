const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge messages')
		.addIntegerOption(option => option.setName('count').setDescription('Number of messages').setRequired(true))
		.addStringOption(option => option.setName('filter').setDescription('Purge user OR bot messages').addChoices(
			{ name: 'Bot messages', value: 'bot'},
			{ name: 'User messages', value: 'user'}
		).setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) 
	{
		const purgeLimit = new EmbedBuilder().setColor('FF0000').setDescription('**You can only purge up to 100 messages.**');
		const purgeAgeLimit = new EmbedBuilder().setColor('FF0000').setDescription('**You cannot purge messages older than 14 days.**');
        
		const filter = interaction.options.getString('filter');
        
		const count = interaction.options.getInteger('count');
		if (count > 100) { await interaction.reply({ embeds: [purgeLimit], ephemeral: true }); return; }
		let msg = await interaction.channel.messages.fetch({ limit: count });

		let success;
		if (msg.size === 1)
		{ success = new EmbedBuilder().setColor('00FF00').setDescription('**Deleted a message.**'); }
		else
		{ 
			const f = filter === 'user' ? 'user' : (filter === 'bot' ? 'bot' : '');
			success = new EmbedBuilder().setColor('00FF00').setDescription(`**Deleted ${msg.size} ${f} messages.**`);
		}

		if (filter === 'user') 
		{ 
			msg = msg.filter(msg => !msg.author.bot);

			await interaction.channel.bulkDelete(msg)
				.then(() => interaction.reply({ embeds: [success], ephemeral: true }))
				.catch(error => {
					if (error.code === 50034) { interaction.reply({ embeds: [purgeAgeLimit], ephemeral: true }); }
				});
		}
		else if (filter === 'bot') 
		{ 
			msg = msg.filter(msg => msg.author.bot);

			await interaction.channel.bulkDelete(msg)
				.then(() => interaction.reply({ embeds: [success], ephemeral: true }))
				.catch(error => {
					if (error.code === 50034) { interaction.reply({ embeds: [purgeAgeLimit], ephemeral: true }); }
				});
		}
		else
		{
			await interaction.channel.bulkDelete(msg)
				.then(() => interaction.reply({ embeds: [success], ephemeral: true }))
				.catch(error => {
					if (error.code === 50034) { interaction.reply({ embeds: [purgeAgeLimit], ephemeral: true }); }
				});
		}
	}
};
