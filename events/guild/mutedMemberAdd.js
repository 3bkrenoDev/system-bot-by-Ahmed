var guildModel = require("../../DataBase/models/guild.js")
module.exports = {
	name: 'guildMemberAdd',
  run:async(member,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(!globalBot && member.guild.id !== ID)return;
    let newData = await guildModel.findOne({guildID:member.guild.id}) 
    if(!newData || !newData.muted.length)return;
    let newobj = newData.muted.find(c => c.userID === member.id)
    if(!newobj)return;
    let role = member.guild.roles.cache.find(c => c.id=== newobj.roleID)
    if(role){
      member.roles.add(role?.id).catch(err => 0)
    }
  }
}