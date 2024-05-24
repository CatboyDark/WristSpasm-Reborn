const { token } = require('./auth.json');
const DCinit = require('./src/discord/DCinit');
const MCinit = require('./src/minecraft/MCinit');

const DC = new DCinit(token);
DC.login();

const MC = new MCinit(DC.client);
MC.login();