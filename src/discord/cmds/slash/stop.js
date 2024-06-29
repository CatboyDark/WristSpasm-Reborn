const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const { CatboyDark, SoupyRaccn } = require('../../../../auth.json');

const notAdmin = (interaction) => 
{
	const notAdmin = new EmbedBuilder().setColor('FF0000').setDescription('**Only <@622326625530544128> or <@448912690329419776> can use this command!**');

	if (interaction.user.id !== SoupyRaccn && interaction.user.id !== CatboyDark) {
		interaction.reply({ embeds: [notAdmin] });
		return true;
	}
	return false;
};

const stop = new EmbedBuilder().setColor('000000').setDescription('**Stopping...**');

const errors = (error, stderr) => 
{
	if (error) { console.log(`Error: ${error.message}`); return; }
	if (stderr) { console.log(`STD Error: ${stderr}`); return; }
};

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
	    .setName('stop')
	    .setDescription('Kill the bot')
	    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		if (notAdmin(interaction)) { return; }

		exec('pm2 stop wsr', errors);

		interaction.reply({ embeds: [stop]});
	}
};
