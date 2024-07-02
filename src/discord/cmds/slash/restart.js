const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const { CatboyDark } = require('../../../../auth.json');

const restart = new EmbedBuilder().setColor('000000').setDescription('**Restarting...**');

const notCatboy = (interaction) => 
{
	const notCatboy = new EmbedBuilder().setColor('FF0000').setDescription('**Only <@622326625530544128> can use this command!**'); 

	if (interaction.user.id !== CatboyDark) 
	{
		interaction.reply({ embeds: [notCatboy] });
		return true;
	}
	return false;
};

const errors = (error, stderr) => 
{
	if (error) { console.log(`Error: ${error.message}`); return; }
	if (stderr) { console.log(`STD Error: ${stderr}`); return; }
};

module.exports = 
{
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restart the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) 
	{
		if (notCatboy(interaction)) { return; };

		exec('git pull && pm2 restart wsr', errors);
		
		interaction.reply({ embeds: [restart] });
	}
};
