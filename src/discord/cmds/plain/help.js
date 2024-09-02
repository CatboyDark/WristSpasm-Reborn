const { createMsg } = require('../../../helper/builder.js');
const { getGuild } = require('../../../helper/utils.js');

module.exports =
{
    name: '.h',

    async execute(message) {
        const embed = createMsg({ desc: '**Super Secret Staff Commands owo**' });

        const guild = await getGuild('guild', 'WristSpasm');
        console.log(guild);

        await message.channel.send({ embeds: [embed] });
    }
};
