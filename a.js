const { token } = require('./auth.json');

const DCinit = require('./src/discord/DCinit');
const DC = new DCinit(token);
DC.login();

const MCinit = require('./src/minecraft/MCinit');
const MC = new MCinit(DC.client);
MC.login();