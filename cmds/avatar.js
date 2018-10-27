module.exports.run = async (msg, args, command, invisible, O) => {
  msg.channel.send({File : msg.author.avatarURL})
}
exports.help = {
  "name" : "avatar"
}
