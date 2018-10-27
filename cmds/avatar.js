module.exports.run = async (msg, args, command, invisible, O) => {
  invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).sendFile(msg.author.avatarURL)
}
exports.help = {
  "name" : "avatar"
}
