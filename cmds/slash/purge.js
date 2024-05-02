const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges messages')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(option => option.setName('count').setDescription('Number of messages to purge').setRequired(true))
		.addBooleanOption(option => option.setName('bots').setDescription('Only purge bot messages').setRequired(false)),

        async execute(interaction) 
        {
            const count = interaction.options.getInteger('count');
            const messages = await interaction.channel.messages.fetch({ limit: count });
            const botMsgs = messages.filter(msg => msg.author.bot);

            const purgeSuccess = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`Deleted ${count} messages.`)
        
            const purgeLimit = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription('You can only purge up to 100 messages.')

            const botPurgeSuccess = new EmbedBuilder()
            .setColor(0x00FF00)
            .setDescription(`Deleted ${count} bot messages.`)

            if (count > 100) { 
                await interaction.reply({ embeds: [purgeLimit], ephemeral: true });
                return;
            }

            if (!interaction.options.getBoolean('bots'))
            {   
                await interaction.channel.bulkDelete(count)
                .then(() => interaction.reply({ embeds: [purgeSuccess], ephemeral: true }))
            } 
            else {
                await interaction.channel.bulkDelete(botMsgs)
                .then(() => interaction.reply({ embeds: [botPurgeSuccess], ephemeral: true }))
            }
        }
}
