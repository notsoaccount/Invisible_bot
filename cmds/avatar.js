module.exports.run = async (invisible, msg, command ,args, cooldown, secs, O) => {
  msg.channel.send({File : `${msg.author.avatarURL}`})
}
exports.help = {
  "name" : "avatar"
}
