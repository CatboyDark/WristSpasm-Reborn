const { token } = require('./auth.json');
const DCinit = require('./src/discord/DCinit');
const MCinit = require('./src/minecraft/MCinit');
const deploy = require('./src/deploy.js');

const a = async () => 
{
	const DC = new DCinit(token);
	await DC.login();

	const MC = new MCinit(DC.client);
	await MC.login();
};

const main = async () => 
{
	await deploy();
	await a();
};

main().catch(console.error);