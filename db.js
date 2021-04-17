const Database = require('better-sqlite3');
const { defaults } = require('./config.json');

class DB {
	constructor(dbFilePath) {
		this.db = new Database(dbFilePath, { verbose: console.log });
	}

	getKey(server, channel, key, nochan = false) {
		let ret = null;
		if (channel !== null) {
			const stmt = this.db.prepare(`SELECT value
			FROM config
			WHERE server = ?
			AND channel = ?
			AND key = ?`);

			ret = stmt.all(server, channel, key);
		}
		
		if (channel === null || (ret.length === 0 && nochan === true)) {
			const stmt = this.db.prepare(`SELECT value
			FROM config
			WHERE server = ?
			AND key = ?`);

			ret = stmt.all(server, key);
		}

		const values = [];
		for (const row of ret) {
			values.push(row.value);
		}

		if (values.length === 0 && defaults[key] !== undefined) return (Array.isArray(defaults[key]) ? defaults[key] : [defaults[key]]);
		else return values;

	}

	getCooldown(server, channel, user) {
		const stmt = this.db.prepare(`SELECT timestamp
		FROM cooldowns
		WHERE server = ?
        AND channel = ?
        AND user = ?`);

		const ret = stmt.get(server, channel, user);

		if (ret === undefined) return -1;
		else return ret.timestamp;
	}

	setCooldown(server, channel, user) {
		const stmt = this.db.prepare(`INSERT INTO cooldowns (server, channel, user, timestamp)
		VALUES (
		?,
		?,
		?,
		strftime('%s','now'))
		ON CONFLICT(server, channel, user)
		DO UPDATE SET timestamp = excluded.timestamp;`);

		stmt.run(server, channel, user);
	}

}

module.exports = DB;