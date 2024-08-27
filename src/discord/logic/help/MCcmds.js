const { createMsg, createRow } = require('../../../helper/builder');
const { readConfig } = require('../../../helper/utils.js');

function createMCcmds()
{
	const config = readConfig();

	return createMsg({
		icon: config.icon,
		title: config.guild,
		desc: '**Ingame Commands**',
		footer: 'Created by @CatboyDark',
		footerIcon: 'https://i.imgur.com/4lpd01s.png'
	});
}

async function MCcmds(interaction) 
{
	interaction.update({ 
		embeds: [createMCcmds()], 
		components: [createRow([
			{id: 'cmds', label: 'Commands', style: 'Green'},
			{id: 'credits', label: 'Credits', style: 'Blue'},
			{id: 'support', label: 'Support', style: 'Blue'},
			{label: 'GitHub', url: 'https://github.com/CatboyDark/Eris'}
		])] 
	});
}

module.exports =
{
	MCcmds
};