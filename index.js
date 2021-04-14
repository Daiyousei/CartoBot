const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// We don't like bots
	if (message.author.bot) return;

	if (message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
	}
	else {
		// We HL ATC on each message
		const role = message.guild.roles.cache.find(r => r.name === 'ATC');
		if (message.attachments.size > 0 && message.mentions.roles.find(r => r.name === 'ATC') === undefined) {

			message.channel.send(`Hey ${role}`);
		}

	}

});

client.login(token);