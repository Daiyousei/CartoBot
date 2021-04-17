CREATE TABLE "config" (
	"ID"	INTEGER NOT NULL,
	"server"	TEXT NOT NULL,
	"channel"	TEXT,
	"key"	TEXT NOT NULL,
	"value"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT)
);

CREATE TABLE "cooldowns" (
	"ID"	INTEGER NOT NULL,
	"server"	TEXT NOT NULL,
	"channel"	TEXT NOT NULL,
	"user"	TEXT NOT NULL,
	"timestamp"	INTEGER NOT NULL,
	UNIQUE("server","channel","user"),
	PRIMARY KEY("ID" AUTOINCREMENT)
)