const { createMsg, createRow } = require('../../../helper/builder.js');
const { readConfig } = require('../../../helper/utils.js');

async function credits(interaction) 
{
	const config = readConfig();
	const creditsMsg = createMsg({
		icon: config.icon,
		title: config.guild,
		desc:
            '**Credits**\n\n' +
            '✦ <@1165302964093722697> ✦\n' +
			'✦ <@486155512568741900> ✦\n' +
			'✦ <@1169174913832202306> ✦\n' +
			'✦ <@468043261911498767> ✦\n\n_ _',
		footer: 'Created by @CatboyDark',
		footerIcon: 'https://i.imgur.com/4lpd01s.png'
	});

	const buttons = createRow([
		{ id: 'cmds', label: 'Commands', style: 'Green' },
		{ id: 'credits', label: 'Credits', style: 'Blue' },
		{ id: 'support', label: 'Support', style: 'Blue' },
		{label: 'GitHub', url: 'https://github.com/CatboyDark/Eris'}
	]);

	interaction.update({ embeds: [creditsMsg], components: [buttons] });
}

module.exports =
{
	credits
};