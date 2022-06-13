var guildModel = require("../../DataBase/models/guild.js")

module.exports = {
	name: 'guildMemberAdd',
  run:async(member,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(!globalBot && member.guild.id !== ID)return;
    let guildData = await guildModel.findOne({
      guildID:member.guild.id
    })
    if(!guildData)return;
    let autoRoles = guildData.autoRoles;
    if(member.user.bot && autoRoles.bots.toggle){
      autoRoles.bots.roles.forEach(role => {
        member.roles.add(role).catch(err => 0)
      })
    }else{
      if(!autoRoles.humans.toggle)return;
      autoRoles.humans.roles.forEach(role => {
        member.roles.add(role).catch(err => 0)
      })
    }
  }
}