module.exports = {
	name: 'conf',
	description: 'Configure Stuff !',
	execute(message, args, db) {

		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !(authorPerms.has('ADMINISTRATOR') || db.getKey(message.guild.id, message.channel.id, 'authuser', true).includes(message.author.id))) {
			return console.debug(`${message.author.id} tried to config`);
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
		case 'adduser' :
			if (message.mentions.members.size == 0) return message.reply('Utilisateur requis');
			db.addKey(message.guild.id, null, 'authuser', Array.from(message.mentions.members.keys()));
			message.react('👍');
			break;
		default : 
			message.reply('Commande inconnue');
		}
		
	},
};