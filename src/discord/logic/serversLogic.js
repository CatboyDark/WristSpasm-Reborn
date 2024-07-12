const { EmbedBuilder } = require('discord.js');

async function sbz(interaction)
{ await interaction.reply({ content: 'https://discord.gg/skyblock', ephemeral: true}); }

async function sbm(interaction)
{ await interaction.reply({ content: 'https://discord.gg/sbm', ephemeral: true}); }

async function cow(interaction)
{ await interaction.reply({ content: 'https://discord.gg/cowshed', ephemeral: true}); }

async function exocafe(interaction)
{ await interaction.reply({ content: 'https://discord.gg/RTm9gkxhHX', ephemeral: true}); }

async function skyhelper(interaction)
{ await interaction.reply({ content: 'https://discord.gg/skyhelper-support-server-720018827433345138', ephemeral: true}); }

async function ims(interaction)
{ await interaction.reply({ content: 'https://discord.gg/ims', ephemeral: true}); }

async function bingob(interaction)
{ await interaction.reply({ content: 'https://discord.gg/bingobrewers', ephemeral: true}); }

async function kuudra(interaction)
{ await interaction.reply({ content: 'https://discord.gg/kuudra', ephemeral: true}); }

async function hunters(interaction)
{ await interaction.reply({ content: 'https://discord.gg/pumpzffDva', ephemeral: true}); }

async function dsg(interaction)
{ await interaction.reply({ content: 'https://discord.gg/u6WCV6B3N2', ephemeral: true}); }

async function patcher(interaction)
{ await interaction.reply({ content: 'https://sk1er.club/', ephemeral: true}); }

async function skyclient(interaction)
{ await interaction.reply({ content: 'https://discord.gg/skyclient', ephemeral: true}); }

async function sba(interaction)
{ await interaction.reply({ content: 'https://discord.gg/RZYf8sfTFF', ephemeral: true}); }

async function st(interaction)
{ await interaction.reply({ content: 'https://discord.gg/skytils', ephemeral: true}); }

async function neu(interaction)
{ await interaction.reply({ content: 'https://discord.gg/moulberry', ephemeral: true}); }

async function ct(interaction)
{ await interaction.reply({ content: 'https://discord.gg/chattriggers', ephemeral: true}); }

async function soopy(interaction)
{ await interaction.reply({ content: 'https://discord.gg/q9Wv6q35th', ephemeral: true}); }

async function drm(interaction)
{ await interaction.reply({ content: 'https://discord.gg/dungeon-rooms-mod-804143990869590066', ephemeral: true}); }

async function dulkir(interaction)
{ await interaction.reply({ content: 'https://discord.gg/CnsM8QXFdJ', ephemeral: true}); }

async function sh(interaction)
{ await interaction.reply({ content: 'https://discord.gg/skyhanni-997079228510117908', ephemeral: true}); }

async function sbe(interaction)
{ 
	const embed = new EmbedBuilder().setColor('FF0000').setDescription('**Note: This mod is NOT free!**');
	await interaction.reply({ embeds: [embed], content: 'https://discord.gg/sbe', ephemeral: true}); 
}

async function cult(interaction)
{ await interaction.reply({ content: 'https://discord.gg/mining', ephemeral: true}); }

async function fcouncil(interaction)
{ await interaction.reply({ content: 'https://discord.gg/farmers', ephemeral: true}); }

async function elitef(interaction)
{ 
	await interaction.reply({ content: 'https://discord.gg/farms', ephemeral: true}); 
}

module.exports = { sbz, sbm, cow, exocafe, skyhelper, ims, bingob, kuudra, hunters, dsg, patcher, skyclient, sba, st, neu, ct, soopy, drm, dulkir, sh, sbe, cult, fcouncil, elitef };