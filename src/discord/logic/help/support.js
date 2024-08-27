const { createMsg, createRow } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');

async function support(interaction) 
{
	const config = readConfig();
	const supportMsg = createMsg({
		icon: config.icon,
		title: config.guild,
		desc:
            '**Bugs and Support  ❤**\n\n' +
            'Please contact <@622326625530544128> for support!\n' +
            'To report any bugs or suggestions, check out our GitHub!\n\n_ _',
		footer: 'Created by @CatboyDark',
		footerIcon: 'https://i.imgur.com/4lpd01s.png'
	});

	const buttons = createRow([
		{ id: 'cmds', label: 'Commands', style: 'Green' },
		{ id: 'credits', label: 'Credits', style: 'Blue' },
		{ id: 'support', label: 'Support', style: 'Blue' },
		{label: 'GitHub', url: 'https://github.com/CatboyDark/Eris'}
	]);

	interaction.update({ embeds: [supportMsg], components: [buttons] });
}

module.exports =
{
	support
};