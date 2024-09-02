const DC = require('./src/discord/DCinit');
const MC = require('./src/minecraft/MCinit');
const Mongo = require('./src/mongo/mongoInit');

class Instance {
    async init() {
        this.discord = new DC();
        this.minecraft = new MC(this.discord.client);
    }

    async start() {
        await Mongo();
        await this.discord.init();
        await this.minecraft.init();
    }
}

const instance = new Instance();

module.exports = instance;

if (require.main === module) {
    instance
        .init()
        .then(() => instance.start())
        .catch(error => console.error(error));
}
