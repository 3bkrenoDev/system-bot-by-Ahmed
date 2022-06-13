var guildModel = require("../../DataBase/models/guild.js")
var { setLongTimeout } = require("../../Functions/utils.js")

module.exports = {
	name: 'ready',
  run:async(client)=> {
    let guildsData = await guildModel.find()
    if(!guildsData.length)return;
    guildsData.forEach(data => {
      let guild = client.guilds.cache.get(data.guildID)
      if(!guild) {
        if(data.muted.length) data.muted = [];
        return data.save()
      }
      data.muted.forEach(user => {
        if(user.time - Date.now() < 1){
          let member = guild.members.cache.get(user.userID)
          let role = guild.roles.cache.find(c => c.id=== user.roleID)
          if(member && role) {
            member.roles.remove(role?.id).catch(err => 0)
          }
          data.muted.splice(data.muted.indexOf(user),1)
          return data.save();
        }else {
          setLongTimeout(() => {
            let member = guild.members.cache.get(user.userID)
            let role = guild.roles.cache.find(c => c.id=== user.roleID)
          if(member && role) {
            member.roles.remove(role?.id).catch(err => 0)
          }
                            data.muted.splice(data.muted.indexOf(user),1)
          return data.save();
          },user.time-Date.now())
  
        }
      })
      
    })
  }
}