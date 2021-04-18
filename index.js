const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');
const DBCO = require('./db.js');

const db = new DBCO('./data.sqlite3');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.debug(`Loaded command ${command.name}`);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// We don't like bots
	if (message.author.bot) return;

	// We require a server
	if (message.guild === null) return;
	
	const prefix = db.getKey(message.guild.id, message.channel.id, 'prefix', true)[0];

	let args = null;
	let command = null;
	if (message.content.startsWith(prefix)) {
		args = message.content.slice(prefix.length).trim().split(/ +/);
		command = args.shift().toLowerCase();
	}

	if (command !== null && client.commands.has(command)) {
		client.commands.get(command).execute(message, args, db);
	}
	else {
		if (message.attachments.size > 0) {
			// This mesage can trigger a HL
			// Let's check if we should regarding HL already done in the message

			let hl = '';
			const tohlroles = [];
			for (const role of db.getKey(message.guild.id, message.channel.id, 'highlight')) {
				const found = message.guild.roles.cache.find(r => r.name === role);
				if (found !== undefined) {
					tohlroles.push(found);
				}
				
			}
			const gothlroles = [ ...message.mentions.roles.values() ];
			
			const b = new Set(gothlroles);
			const difference = [...tohlroles].filter(x => !b.has(x));

			for (const role of difference) {
				if (hl === '') hl = `${role}`;
				else hl = `${hl}, ${role}`;
			}

			// Let's check the cooldown too
			const cooldownTS = db.getCooldown(message.guild.id, message.channel.id, message.author.id);

			const delay = db.getKey(message.guild.id, message.channel.id, 'delay')[0];

			if (difference.length > 0 && (cooldownTS < 0 || Math.floor(Date.now() / 1000) - cooldownTS > delay)) {
				const text = db.getKey(message.guild.id, message.channel.id, 'message', true)[0];
				message.channel.send(`${hl}, ${text}`);
			}

			// We update cooldown anyway
			db.setCooldown(message.guild.id, message.channel.id, message.author.id);
		}

	}

});

client.login(token);