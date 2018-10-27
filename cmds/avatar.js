mdoule.exports.run = async (msg, args, command, invisible, O) => {
  msg.channel.send({
  File : msg.author.avatarURL,
  Name : msg.author.username
})
}
exports.help = {
  "name" : "avatar"
}
