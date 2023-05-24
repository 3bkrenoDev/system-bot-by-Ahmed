var guildModel = require("../../DataBase/models/guild.js")
const Discord = require("discord.js")
module.exports = {
  name: 'messageCreate',
  run: async (message, client) => {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if (message.author.id === client.user.id || (!globalBot && message.guild.id !== ID)) return;
    let newData = await guildModel.findOne({ guildID: message.guild.id })
    if (!newData || !newData.autoLinesChannel.length) return;
    let obj = newData.autoLinesChannel.find(c => c.channelId === message.channel.id)
    if (!obj) return;
    let att = new Discord.MessageAttachment(obj.line, "line.gif")
    message.channel.send({ files: [att] }).catch(err => 0)
  }
}
