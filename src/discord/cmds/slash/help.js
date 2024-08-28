const { cmds } = require('../../logic/help/help.js');

module.exports =
{
	name: 'help',
	desc: 'Display bot info',
    
	async execute(interaction) 
	{
		await cmds(interaction);
	}
};