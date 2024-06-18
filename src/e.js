const { EmbedBuilder } = require('discord.js');
const { CatboyDark } = require('../auth.json');

const unknownErr = new EmbedBuilder().setColor('FF0000').setDescription('**Unknown Error! Please contact staff.**');

const errors = (error, stderr) => 
{
	if (error) { console.log(`Error: ${error.message}`); return; }
	if (stderr) { console.log(`STD Error: ${stderr}`); return; }
};

const cmdErrors = (interaction) =>
{
	return error => 
	{
		const e = new EmbedBuilder().setColor('FF0000').setTitle('Error!').setDescription(`${error.message}`);

		console.error(error);
		if (interaction.replied || interaction.deferred) 
		{ return interaction.followUp({ embeds: [e], ephemeral: true }); } 
		else { return interaction.reply({ embeds: [e], ephemeral: true }); }
	};
};

const notCatboy = (interaction) => 
{
	const notCatboy = new EmbedBuilder().setColor('FF0000').setDescription('**Only <@622326625530544128> can use this command!**');

	if (interaction.user.id !== CatboyDark) {
		interaction.reply({ embeds: [notCatboy] });
		return true;
	}
	return false;
};

// purge

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

// role

const permCheck = (interaction, user, role) =>
{
	const noAddPerms = new EmbedBuilder().setColor('FF0000').setDescription('**You do not have permission to assign this role.**');
	const noRemovePerms = new EmbedBuilder().setColor('FF0000').setDescription('**You do not have permission to remove this role.**');

	if (interaction.member.roles.highest.comparePositionTo(role) <= 0) 
	{
		if (user.roles.cache.has(role.id)) 
		{  interaction.reply({ embeds: [noRemovePerms]}); return true; }
		else {  interaction.reply({ embeds: [noAddPerms] }); return true; }
	}
	return false;
};

// rr

const rrPermCheck = (interaction, role) =>
{
	const noPerms = new EmbedBuilder().setColor('FF0000').setDescription('**You do not have permission to assign this role.**');

	if (interaction.member.roles.highest.comparePositionTo(role) <= 0) 
	{ interaction.reply({ embeds: [noPerms], ephemeral: true }); return true; }
	return false;
};

// link

const link = (interaction, player) =>
{
	const invalidIGN = new EmbedBuilder().setColor('FF0000').setDescription('**Invalid IGN**');

	if (!player) { interaction.reply({ embeds: [invalidIGN], ephemeral: true });  return true;}
	return false;
};

const match = (interaction, discord) =>
{
	const noMatch = new EmbedBuilder().setColor('FF0000').setDescription('**Your Discord does not match!**');

	if (!interaction.user.tag === discord) 
	{ interaction.reply({ embeds: [noMatch] }); return true; }
};

const nickPerms = (error) => 
{
	console.error('Failed to set nickname:', error);
	const embed = new EmbedBuilder().setColor('FFA500').setDescription(`**Warning: ${error.message}**`);
	return embed;
};

module.exports = 
{
	unknownErr,
	errors,
	cmdErrors,
	notCatboy,
	countCheck,
	ageCheck,
	permCheck,
	rrPermCheck,
	link,
	match,
	nickPerms
};
