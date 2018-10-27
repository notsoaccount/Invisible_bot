module.exports.run = async (msg, args, command, invisible, O) => {
  invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send({
  File : msg.author.avatarURL,
  Name : msg.author.username
})
}
exports.help = {
  "name" : "avatar"
}
