function send(bot, str)
{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let rString = '';
    for (let i = 0; i < 5; i++) {
        const rIndex = Math.floor(Math.random() * chars.length);
        rString += chars[rIndex];
    }
    bot.chat(`${str} [${rString}]`);
}

module.exports = { send };