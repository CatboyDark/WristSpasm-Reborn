const { Events } = require('discord.js');
const log = require('../../helper/logger.js');
const { readLogic } = require('../../helper/utils.js');

const Logic = readLogic();
	
const map = 
{
	'createLevelRoles': ['level0', 'level40', 'level80', 'level120', 'level160', 'level200', 'level240', 'level280', 'level320', 'level360', 'level400', 'level440', 'level480']
};

const menuHandler = async (interaction) => 
{
	const { values } = interaction;
	const selectedValue = values[0];
	
	let logicFunction = Logic[selectedValue];
	if (!logicFunction) 
	{
		const mappedLogicKey = Object.keys(map).find(key => map[key].includes(selectedValue));
		if (mappedLogicKey) 
			logicFunction = Logic[mappedLogicKey];
	}

	if (logicFunction) await logicFunction(interaction);
	else 
	{
		const missingKey = Object.keys(map).find(key => map[key].includes(selectedValue));

		if (missingKey) 
			console.warn(`Logic for ${selectedValue} (${missingKey}) does not exist!`);
		else 
			console.warn(`Logic for ${selectedValue} does not exist!`);
	}
};
	
module.exports = 
[
	{
		name: Events.InteractionCreate,
		async execute(interaction) 
		{
			if (!interaction.isStringSelectMenu()) return;
			log(interaction);

			await menuHandler(interaction);
		}
	}
];