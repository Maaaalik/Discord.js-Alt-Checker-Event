const { MessageEmbed } = require("discord.js");
var moment = require('moment')

module.exports = (client) => {

    client.on('guildMemberAdd', async (member) => {
        if (Date.now() - member.user.createdAt < 1000*60*60*24*1) {
            // Log Channel
            const logChan = "<Your log channel>"
            let channel = client.channels.cache.get(logChan);

            //Embed for log channel
            const embed = new MessageEmbed()
                .setColor('RED')
                .setAuthor('\u200b', client.user.displayAvatarURL())
                .setDescription(`⚠ **Possible Alt Account**
                User: ${member.user}
                Created: ${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()} @ **${moment(member.user.createdAt).format('hh:mm a')}**
                *Check to see if they look like an alt account of a recent banned member (Could be a profile picture, name, etc)*`)
                .setFooter(`User's ID: ${member.id}`)
                .setTimestamp();
            
            // Sends embed & kick msg with reactions
                channel.send(embed)
                msg = await channel.send('Would you like for me to kick them?')
                msg.react('👍').then(() => msg.react('👎'))

            // Checking for reactionss
                msg.awaitReactions((reaction, user) => (reaction.emoji.name == '👍' || reaction.emoji.name == '👎') && (user.id !== client.user.id) , { max: 1, time: 600000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '👍') {
                            member.kick()
                            return msg.edit('User has been kicked!')
                        } else if (reaction.emoji.name === '👎') {
                           return msg.edit('Fine! The user can stay!')
                        }
                    })
                    .catch(collected => {
                        channel.send('You had 10 minutes to kick this user! Now, you must kick them manually.')
                    })
                    .catch(error => {
                        console.log(error)
                    });
        }
    })

}
