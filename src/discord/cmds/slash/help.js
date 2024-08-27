const { cmds } = require('../../logic/help/help.js');
const { createSlash } = require('../../../helper/builder.js');

module.exports = createSlash({
	name: 'help',
	desc: 'Display bot info',
    
	async execute(interaction) 
	{
		await cmds(interaction);
	}
});