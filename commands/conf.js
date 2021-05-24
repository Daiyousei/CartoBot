module.exports = {
	name: 'conf',
	description: 'Configure Stuff !',
	execute(message, args, db) {
		const { admins } = require('../config.json');

		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !(authorPerms.has('ADMINISTRATOR') || db.getKey(message.guild.id, message.channel.id, 'authuser', true).includes(message.author.id) || admins.has(message.author.id))) {
			console.debug(`${message.author.id} tried to config`);
			return message.react('❌');
		}

		if (args.length === 0) {
			return message.reply('Argument requis');
		}

		const command = args.shift().toLowerCase();

		switch(command) {
		case 'setping' :
			if (message.mentions.roles.size == 0) return message.reply('Roles requis');
			db.delAllKey(message.guild.id, message.channel.id, 'highlight');
			db.addKey(message.guild.id, message.channel.id, 'highlight', Array.from(message.mentions.roles.values(), x => x.name));
			message.react('👍');
			break;
		case 'unsetping' :
			db.delAllKey(message.guild.id, message.channel.id, 'highlight');
			message.react('👍');
			break;

		case 'setmessage' :
			if (args.length == 0) return message.reply('Message requis');
			db.delAllKey(message.guild.id, message.channel.id, 'message');
			db.addKey(message.guild.id, message.channel.id, 'message', [args.join(' ')]);
			message.react('👍');
			break;
		case 'unsetmessage' :
			db.delAllKey(message.guild.id, message.channel.id, 'message');
			message.react('👍');
			break;
		case 'getmessage' :
			message.reply(db.getKey(message.guild.id, message.channel.id, 'message', true)[0]);
			break;

		case 'setdelay' :
			if (args.length !== 1 && args[0].match(/^\d+$/)) return message.reply('Delais requis');
			db.delAllKey(message.guild.id, message.channel.id, 'delay');
			db.addKey(message.guild.id, message.channel.id, 'delay', [args[0]]);
			message.react('👍');
			break;
		case 'unsetdelay' :
			db.delAllKey(message.guild.id, message.channel.id, 'delay');
			message.react('👍');
			break;
		case 'getdelay' :
			message.reply(db.getKey(message.guild.id, message.channel.id, 'delay', true)[0]);
			break;

		case 'adduser' :
			if (message.mentions.members.size == 0) return message.reply('Utilisateur requis');
			db.addKey(message.guild.id, null, 'authuser', Array.from(message.mentions.members.keys()));
			message.react('👍');
			break;
		case 'deluser' :
			const matchesUser = Array.from(message.content.matchAll(/<@!?(\d+)>/g), x => x[1]);
			const matchesUnknown = Array.from(message.content.matchAll(/Unknown:(\d+)/g), x => x[1]);

			const match = matchesUser.concat(matchesUnknown);

			if (match.size == 0) return message.reply('Utilisateur requis');
			db.delKeyValue(message.guild.id, null, 'authuser', match);
			message.react('👍');
			break;
		case 'getuser':
			const users = db.getKey(message.guild.id, message.channel.id, 'authuser', true);
			let hl = '-';
			for (const user of users) {
				const member = message.guild.members.cache.get(user);
				let txt;
				if (member === undefined) txt = `Unknown:${user}`;
				else txt = `${member}`;
				
				if (hl === '-') hl = txt;
				else hl = `${hl}, ${txt}`;
			}
			message.channel.send(hl);
			break;

		case 'setdelete':
			if (db.getKey(message.guild.id, message.channel.id, 'deleteMessage')[0] === 'false') {
				db.addKey(message.guild.id, message.channel.id, 'deleteMessage', ['true']);
			}
			message.react('👍');
			break;
		case 'unsetdelete':
			db.delAllKey(message.guild.id, message.channel.id, 'deleteMessage');
			message.react('👍');
			break;			

		default : 
			message.reply('Commande inconnue');
		}
		
	},
};