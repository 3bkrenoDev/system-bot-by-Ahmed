const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
module.exports = {
  name: `active`,
  description: 'Active member.',
  type: 'CHAT_INPUT',
  options: [
    {
      name:"user",
      description: "Target to active!",
      type:"USER",
      required:true,
    },{
      name:"name",
      description: "The name to change to.",
      type:"USER",
      required:true,
    }
  ],
  onlyAdmins:true,
  cooldown:10,
  botPermissions:["MANAGE_ROLES","MANAGE_NICKNAMES"],
  run:async(client, interaction,args,guildData)=> {
    let member = interaction.options.getMember("user");
    let name = interaction.options.getMember("name");
    if(!member) return;
    let temps = guildData.active.temp
    let activated = guildData.active.activated
    let log = client.channels.cache.get(guildData.active.log)
    if(!activated.length) return;
    let already = temps.filter(c => !member.roles.cache.has(c)).map(c => c)
    if(already.length) return interaction.reply(`**🙄 - This member has been activated or does not have temporary roles. **`); 
    if(temps.length){
      temps.forEach(c => {
        let role = interaction.guild.roles.cache.get(c)
        if(role){
          member.roles.remove(c).catch(err => 0)
        }
      })
    }
    if(activated.length){
      activated.forEach(c => {
        let role = interaction.guild.roles.cache.get(c)
        if(role){
          member.roles.add(c).catch(err => 0)
        }
      })
      member.setNickname(name).catch(err => 0)
    }
    if(log){
      log.send({content:`${member.user} activated by ${interaction.member}`})
    }
    return interaction.reply({content:`**@${member.user.username} activated ✅**`})

  }
}
