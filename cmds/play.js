var { Client, Util, notDiscord } = require('discord.js');

var invisible = require("discord.js")

var key = require('./key.json');

var GOOGLE_API_KEY = key.stupid_key;

var YouTube = require('simple-youtube-api');

var ytdl = require('ytdl-core');

var youtube = new YouTube(GOOGLE_API_KEY);

var queue = new Map();

module.exports.run = async (invisible, msg, command , cooldown, secs, O) => {

	var args = msg.content.slice(1).trim().split(/ +/g);
	
	var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	
	var serverQueue = queue.get(invisible.guilds.get(msg.guild.id));

	if (command === 'play') {
	    
	    var msgg = ""
	    
		var voiceChannel = invisible.guilds.get(msg.guild.id).members.get(msg.author.id).voiceChannel;
		
		if (!voiceChannel) return msg.channel.send(`\`\`\`py\n"You" are not in any voice channel..\n\`\`\``);
		
		var permissions = voiceChannel.permissionsFor(invisible.user.id);
		
		if (!permissions.has('CONNECT')) {
		    
			return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI can't connect to "${invisible.guilds.get(msg.guild.id).members.get(msg.author.id).voiceChannel.name}"..\n\`\`\``);
			
		}
		
		if (!permissions.has('SPEAK')) {
		    
			return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI can't speak in "${invisible.user.id.voiceChannel.name}"..\n\`\`\``);
			
		}
		
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		    
			var playlist = await youtube.getPlaylist(url);
			
			var videos = await playlist.getVideos();
			
			for (var video of Object.values(videos)) {
			    
				var video2 = await youtube.getVideoByID(video.id); 
				
				await handleVideo(video2, msg, voiceChannel, true); 
				
			}
			
			return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\n"${playlist.title}" has been added to the queue!\n\`\`\``);
			
		} else {
		    
			try {
			    
				var video = await youtube.getVideo(url);
				
			} catch (error) {
			    
				try {
				    
					var videos = await youtube.searchVideos(searchString, 10);
					
					let index = 0;
					
					invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nResults for ${args} :\n${videos.map(video2 => `${++index}. "${video2.title}"\n\`\`\``).join('\n')}`);
					
					try {
					    
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
						    
							maxMatches: 1,
							
							time: 10000,
							
							errors: ['time']
							
						});


					} catch (err) {
					    
						console.error(err);
						
						return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send('No or invalid value entered, cancelling video selection.');
						
					}
						
					response.first().delete();
					
					const videoIndex = parseInt(response.first().content);
					
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
					
					var msg1 = invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).messages.get(msgg);
					
					if (!msg1) return;
					
					msg1.delete();
					
				} catch (err) {
				    
					console.error(err);
					
					return msg.channel.send(`\`\`\`py\n🆘 I could not obtain any search results.\n\`\`\``);
					
				}
				
			}
			
			return handleVideo(video, msg, voiceChannel);
			
		}
	}
}
module.exports.help = {
    name : "play"
}

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    
	const serverQueue = queue.get(invisible.user.guilds.get(msg.guild.id));
	
	console.log(video);
	
	const song = {
	    
		id: video.id,
		
		title: Util.escapeMarkdown(video.title),
		
		url: `https://www.youtube.com/watch?v=${video.id}`
		
	};
	
	if (!serverQueue) {
	    
		var queueConstruct = {
		    
			textChannel: invisible.user.guilds.get(msg.guild.id).channels.get(msg.channel.id),
			
			voiceChannel: voiceChannel,
			
			connection: null,
			
			songs: [],
			
			volume: 5,
			
			playing: true
			
		};
		
		
		queue.set(invisible.user.guilds.get(msg.guild.id), queueConstruct);

		queueConstruct.songs.push(song);

		try {
		    
			var connection = await voiceChannel.join();
			
			queueConstruct.connection = connection;
			
			play(invisible.user.guilds.get(msg.guild.id), queueConstruct.songs[0]);
			
		} catch (error) {
		    
			console.error(`I could not join the voice channel: ${error}`);
			
			queue.delete(msg.guild.id);
			
			return msg.channel.send(`\`\`\`error\n${error}\n\`\`\``);
			
		}
	} else {
	    
		serverQueue.songs.push(song);
		
		console.log(serverQueue.songs);
		
		if (playlist) return undefined;
		
		else return msg.channel.send(`\`\`\`py\n"${song.title}" has been added to the queue!\n\`\`\``);
		
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`\`\`\`py\n"${song.title}" is now playing..\n\`\`\``);
}
