var guildModel = require("../../DataBase/models/guild.js")
const { MessageEmbed } = require("discord.js")
module.exports = {
	name: 'messageCreate',
  run:async(message,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(message.author.bot || !message.guild || (!globalBot && message.guild.id !== ID)) return;
    let guildData = await guildModel.findOne({ 
      guildID:message.guild.id
    })
    if(!guildData || !guildData.autoReply.length) return;
    let obj = guildData.autoReply.find(c => c.trigger.toLowerCase() === message.content.toLowerCase())
    if(!obj) return;
    let response = obj.response.replaceAll("{user}",message.author).replaceAll("{username}",message.author.username)
    let embed = obj.embed
    let inline_reply = obj.inline_reply
    let delete_trigger = obj.delete_trigger
    let embed1 = new MessageEmbed()
    .setDescription(response)
    .setColor("BLACK")
    .setFooter({text:client.user.username,iconURL:client.user.avatarURL()})
    let content = embed ? {embeds:[embed1]} : {content:response} 
    let reply = await (inline_reply ? message.reply(content) : message.channel.send(content)).catch(err => 0)
    if(delete_trigger) message.delete().catch(err => 0)
    
    
  }
}