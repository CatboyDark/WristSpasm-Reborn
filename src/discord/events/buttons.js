const { Events } = require('discord.js');
const log = require('../../helper/logger.js');
const { readLogic } = require('../../helper/utils.js');

const map = // Exceptions
{
	'logging': ['logsToggle', 'logCommandsToggle', 'logButtonsToggle', 'logMenusToggle', 'logFormsToggle' ],
	'welcome': ['welcomeMsgToggle', 'welcomeRoleToggle', 'removeRoleOnLink' ],
	'accountLinking': ['linkRoleToggle', 'guildRoleToggle'],
	'guildRanksToggle': ['guildRank1', 'guildRank2', 'guildRank3', 'guildRank4', 'guildRank5']
};

const Logic = readLogic();

const buttonHandler = Object.keys(Logic).reduce((acc, logicName) => 
{
	acc[logicName] = Logic[logicName];

	for (const [exceptionLogic, buttonIds] of Object.entries(map)) 
	{
		if (exceptionLogic === logicName) 
			buttonIds.forEach(buttonId => { acc[buttonId] = Logic[exceptionLogic]; });
	}

	return acc;
}, {});

module.exports = 
[
	{
		name: Events.InteractionCreate,
		async execute(interaction) 
		{
			if (!interaction.isButton()) return;
			log(interaction);

			const customId = interaction.customId;
			const handler = buttonHandler[customId];

			if (handler) await handler(interaction);
			else 
			{
				const exceptionLogic = Object.keys(map).find(logic => map[logic].includes(customId));

				if (exceptionLogic) 
				{
					if (!Logic[exceptionLogic])
						console.warn(`Logic for ${customId} (${exceptionLogic}) does not exist!`);
				} 
				else 
				{
					console.warn(`Logic for ${customId} does not exist!`);
				}
			}
		}
	}
];