const { createMsg } = require('../../../helper/builder.js');

module.exports = 
{
	name: '.h',

	async execute(message) 
	{
		const embed = createMsg({ desc: '**Super Secret Staff Commands owo**' });
		
		await message.channel.send({ embeds: [embed] });
	}
};
