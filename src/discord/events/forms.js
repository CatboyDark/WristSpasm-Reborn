const { Events } = require('discord.js');
const log = require('../../helper/logger.js');
const { readLogic } = require('../../helper/utils.js');

const Logic = readLogic();

const map = // Exceptions
{
	'createLevelRoles': ['level0Form', 'level40Form', 'level80Form', 'level120Form', 'level160Form', 'level200Form', 'level240Form', 'level280Form', 'level320Form', 'level360Form', 'level400Form', 'level440Form', 'level480Form'],
	'guildRanksToggle': ['guildRank1Form', 'guildRank2Form', 'guildRank3Form', 'guildRank4Form', 'guildRank5Form']
};

const formHandler = Object.keys(Logic).reduce((acc, logicName) => 
{
	const formId = `${logicName}Form`;
	acc[formId] = Logic[logicName];

	if (map[logicName]) 
	{
		map[logicName].forEach(formId => 
		{
			acc[formId] = Logic[logicName];
		});
	}

	return acc;
}, {});
	
module.exports = 
[
	{
		name: Events.InteractionCreate,
		async execute(interaction) 
		{
			if (!interaction.isModalSubmit()) return;
			log(interaction);

			const logicName = interaction.customId.replace(/Form$/, '');
			const handler = formHandler[`${logicName}Form`];
	
			if (handler) await handler(interaction);
			else {
				const exceptionLogic = Object.keys(map).find(logic => map[logic].includes(interaction.customId));

				if (exceptionLogic) 
					console.warn(`Logic for ${interaction.customId} (${exceptionLogic}) does not exist!`);
				else 
					console.warn(`Logic for ${interaction.customId} does not exist!`);
			}
		}
	}
];