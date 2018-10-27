module.exports.run = async (invisible, msg, command ,args, cooldown, secs, O) => {
  return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send({
    File : msg.author.avatarURL,
    Name : msg.author.username
})
}
exports.help = {
  "name" : "avatar"
}
