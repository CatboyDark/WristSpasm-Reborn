const { Events } = require('discord.js');
const log = require('../../helper/logger.js');
const { readLogic } = require('../../helper/utils.js');

const Logic = readLogic();
	
const map = 
{
	'createLevelRoles': ['level0', 'level40', 'level80', 'level120', 'level160', 'level200', 'level240', 'level280', 'level320', 'level360', 'level400', 'level440', 'level480'],
	'testFunction': ['a', 'c']
};

const menuHandler = async (interaction) =>
{
	const { values } = interaction;
	const selectedValue = values[0];
	
	let logicFunction = null;
	
	for (const [key, valueList] of Object.entries(map))
	{
		if (valueList.includes(selectedValue))
		{
			logicFunction = Logic[key];
			break;
		}
	}
	
	if (!logicFunction)
	{
		logicFunction = Logic[selectedValue];
	}
	
	if (logicFunction)
	{
		await logicFunction(interaction);
	}
	else
	{
		let missingKey = null;
	
		for (const [key, valueList] of Object.entries(map))
		{
			if (valueList.includes(selectedValue))
			{
				missingKey = key;
				break;
			}
		}
	
		if (missingKey)
		{
			console.warn(`Logic for ${missingKey} is missing for ${selectedValue}.`);
		}
		else
		{
			console.warn(`Logic for ${selectedValue} does not exist!`);
		}
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