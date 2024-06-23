const slashHelp = require('../slash/help.js');

module.exports = 
{
	type: 'plain',
	name: '.h',

	execute(message) 
	{
		slashHelp.execute(message);
	}
};
