const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const e = require('../../../e.js');

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		if (e.notCatboy(interaction)) { return; };

		const restart = new EmbedBuilder().setColor('000000').setDescription('**Restarting...**');

		exec('git pull && pm2 restart wsr', e.errors);

		interaction.reply({ embeds: [restart] });
	}
};
