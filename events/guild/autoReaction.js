var Module = require("../../DataBase/models/guild.js")
const Discord = require("discord.js")
module.exports = {
	name: 'messageCreate',
  run:async(message,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(message.author.id ===client.user.id || (!globalBot && message.guild.id !== ID)) return;
    let guildData = await Module.findOne({guildID:message.guild.id}) 
    if(!guildData || !guildData.autoReactionChannel.length)return;
    let obj = guildData.autoReactionChannel.find(c => c.channelId === message.channel.id)
    if(!obj) return;
    let length = obj.emojis.length
    for(let i =0; i < length; i++){
      message.react(obj.emojis[i]).catch(err => {
        if(err.message.includes("Unknown Emoji")){
          obj.emojis.splice(
            obj.emojis.indexOf(obj.emojis[i]),1
          )
        }
      })
      if(i === length -1 ){
        setTimeout(async() => {
         if(length ===  obj.emojis.length)return;
           guildData.autoReactionChannel[guildData.autoReactionChannel.indexOf(obj)] = obj
          await Module.findOneAndUpdate({guildID:message.guild.id},{autoReactionChannel:guildData.autoReactionChannel})
        },2000*i)
      }
    }
  }
}