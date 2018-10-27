var hastebin = require('hastebin-gen');
module.exports.run = async (invisible, msg, command ,args, cooldown, secs, O) => {
        if (cooldown.has(invisible.users.get(msg.author.id))) {
            return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nWait 4 seconds..\n\`\`\``).then(async m => m.delete(4333))
            
        } else {
            
            if(!invisible.guilds.get(msg.guild.id).members.get(msg.author.id).hasPermission("MANAGE_MESSAGES")) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send("```fix\nYou lack permissions..\n```").then(async m => m.delete(4333))
                
     
            if(!invisible.guilds.get(msg.guild.id).members.get(invisible.user.id).hasPermission("MANAGE_MESSAGES")) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send("```fix\nI lack permissions..\n```").then(async m => m.delete(4333))
                
            
            var count = parseInt(args[1]);
            
            if (count <= 0) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`fix\nInvailed numbers..\n\`\`\``).then(async m => m.delete(4333))
     
            if (!args[1]) {
                await msg.delete()
                await invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).bulkDelete(100, true).then(async msgs => {
                    if (msgs.size == 0 || msgs.size == 1) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find any msg to "${command}"\n# You should to know that i can't ${command} the very old msgs..\n\`\`\``).then(async m => m.delete(4333))
                    else {
                        var x = 0
                        var m = await msgs.sort((a, b) => a.createdTimestamp > b.createdTimestamp).map(m => `${++x}. ${m.author.tag} : ${m.content.split(" ").join(" ")}`).join("\n")
                        await hastebin(m, "md").then(async url => {
                            return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nBulked ${msgs.size} msgs..\n# ${url}\n\`\`\``)
                        })                        
                    }
                })
            }
            if (args[1]) {
                await msg.delete()
                var mention;
                mention = invisible.guilds.get(msg.guild.id).member(msg.mentions.users.first());
                if (mention) {
                        await invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).fetchMessages().then(async msgs => {
                            await invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).bulkDelete(msgs.filter(m => m.author.id == mention.id)).then(async msgs => {
                                if (msg.author.id == msg.mentions.users.first().id) {
                                    if (msgs.size == 0 || msgs.size == 1) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find any msg for "YOU" to "${command}"\n# You should to know that i can't ${command} the very old msgs..\n\`\`\``).then(async m => m.delete(4333))
                                    var x = 0
                                    var m = await msgs.sort((a, b) => a.createdTimestamp > b.createdTimestamp).map(m => `${++x}. ${m.author.tag} : ${m.content.split(" ").join(" ")}`).join("\n")
                                    await hastebin(m, "md").then(async url => {
                                        return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nBulked ${msgs.size} msgs for "You"..\n# ${url}\n\`\`\``)
                                    })
                                } else {
                                    if (msgs.size == 0) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find any msg for "${mention.user.tag}" to "${command}"\n# You should to know that i can't ${command} the very old msgs..\n\`\`\``).then(async m => m.delete(4333))
                                    var x = 0
                                    var m = await msgs.sort((a, b) => a.createdTimestamp > b.createdTimestamp).map(m => `${++x}. ${m.author.tag} : ${m.content.split(" ").join(" ")}`).join("\n")
                                    await hastebin(m, "md").then(async url => {
                                        return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nBulked ${msgs.size} msgs for "${mention.user.tag}"..\n# ${url}\n\`\`\``)
                                    })                                
                                }                  
                            })
                        })
                }   //
     
                else if (isNaN(count)) {
                    return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find "${args[1]}" in the guild, plz mention him...\n\`\`\``).then(async m => m.delete(4333))
                } 
               
                else if (count) {
                    if (count == 100) {
                            await invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).bulkDelete(100, true).then(async msgs => {
                                if (msgs.size == 0 || msgs.size == 1) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find any msg to "${command}"\n# You should to know that i can't ${command} the very old msgs..\n\`\`\``).then(async m => m.delete(4333))
                                else {
                                    var x = 0
                                    var m = await msgs.sort((a, b) => a.createdTimestamp > b.createdTimestamp).map(m => `${++x}. ${m.author.tag} : ${m.content.split(" ").join(" ")}`).join("\n")
                                    await hastebin(m, "md").then(async url => {
                                        return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nBulked ${msgs.size}/${count} msgs..\n# ${url}\n\`\`\``)
                                    })
                                }
                            })
                    }   //
                    else if (count !== 100 && count < 100) {
                        await invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).bulkDelete(count, true).then(async msgs => {
                            if (msgs.size == 0 || msgs.size == 1) return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nI cant find any msg to "${command}"\n# You should to know that i can't ${command} the very old msgs..\n\`\`\``).then(async m => m.delete(4333))
                            else {
                                var x = 0
                                var m = await msgs.sort((a, b) => a.createdTimestamp > b.createdTimestamp).map(m => `${++x}. ${m.author.tag} : ${m.content.split(" ").join(" ")}`).join("\n")
                                await hastebin(m, "md").then(async url => {
                                    return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`py\nBulked ${msgs.size}/${count} msgs..\n# ${url}\n\`\`\``)
                                })
                            }
                        })                        
                    }
                
                    else {
                        return invisible.guilds.get(msg.guild.id).channels.get(msg.channel.id).send(`\`\`\`fix\nInvailed numbers..\n\`\`\``).then(async m => m.delete(4333))
                    }
                }
                }   
            }   
            cooldown.add(invisible.users.get(msg.author.id));
            
            setTimeout(async() => {
                
                cooldown.delete(invisible.users.get(msg.author.id));
              
            }, secs * 1000);
}

exports.help = {
  "name" : "clear"
}
