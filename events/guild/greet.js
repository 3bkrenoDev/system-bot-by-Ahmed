var guildModel = require("../../DataBase/models/guild.js")

module.exports = {
	name: 'guildMemberAdd',
  run:async(member,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(!globalBot && member.guild.id !== ID)return;
    let newData = await guildModel.findOne({guildID:member.guild.id})
    if(!newData)return;
    let greet = newData.greet
    let channel = client.channels.cache.get(greet.channel)
    if(!channel)return;
    let message = greet.message.replaceAll('%user.mention%',member).replaceAll('%user.fullname%',member.user.tag).replaceAll('%user.name%',member.user.username).replaceAll('%user.discrim%',member.user.discriminator).replaceAll('%user.id%',member.id);
    channel.send(message).then(c => {
      setTimeout(() => {
        c.delete().catch(err => 0)
      },greet.time*1000)
    }).catch(err => 0)
  }
}