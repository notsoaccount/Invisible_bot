var notDiscord = require("discord.js")
 
var invisible = new notDiscord.Client({disableEveryone : true})
 
var hastebin = require('hastebin-gen');

var settings = require("./settings.json")

var cooldown = new Set();

invisible.commands = new notDiscord.Collection();

invisible.aliases = new notDiscord.Collection();

var secs = 4;

var prefix = settings.prefix;

var fs = require("fs")

var O = settings.id;

invisible.login(settings.token)

invisible.on("ready", async () => console.log("invisible_bot is ready!!"))
 
invisible.on("error", async error => console.error(error))

invisible.on("warn", async warn => console.warn(warn))


fs.readdir('./cmds/', (err, files) => {
	if (err) console.error(err);
	var jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0) {
		console.log('No commands to load!');
		return undefined;
	}
	console.log(`[Commands]\tLoaded a total amount ${files.length} Commands`);
	jsfiles.forEach(f => {
		var props = require(`./cmds/${ f }`);
		props.fileName = f;
		invisible.commands.set(props.help.name, props);
	});
});


invisible.on("message", msg => {
 
    if (invisible.users.get(msg.author.id).bot) return undefined;
   
    if (!msg.content.toLowerCase().startsWith(prefix)) return undefined;
   
    if (invisible.channels.get(msg.channel.id).type !== "text") return undefined;
   
    var args = msg.content.split(" ")

    var command = msg.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();


	var cmd;

	if (invisible.commands.has(command)) {
		cmd = invisible.commands.get(command);
	} else if (invisible.aliases.has(command)) {
		cmd = invisible.commands.get(invisible.aliases.get(command));
	}
	cmd.run(invisible, msg, args, cooldown, secs);
});
