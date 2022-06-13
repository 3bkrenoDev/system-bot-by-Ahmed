const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
let types = [{name:"Activated",value:"activated"},{name:"Temp",value:"temp"},{name:"Admin",value:"admin"}]
let permissions = ["MANAGE_GUILD","MANAGE_CHANNELS","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR"]

module.exports = {
  name: `activeconfig`,
  description: 'Config server activation roles.',
  type: 'CHAT_INPUT',
  onlyShip:true,
  options: [
    {
      name: "add",
      type: 1,
      description: `Add roles for [${types.join("/")}]!`,
      options: [
        {
          name: "type",
          description: "Type to add roles to.",
          type: 3,
          choices:types,
          required:true
        },
        {
          name:"role",
          description: "Role to add in the type.",
          type: 8,
          required:true
        }
      ],
    },
    {
      name: "remove",
      type: 1,
      description: `Remove roles from [${types.join("/")}]!`,
      options: [
        {
          name: "type",
          description: "Type to remove roles from.",
          type: 3,
          choices:types,
          required:true
        },
        {
          name:"role",
          description: "Role to remove from the type.",
          type: 8,
          required:true
        }
      ],
    },
    {
      name: "list",
      type: 1,
      description: "List type roles in the server.",
      options: [
        {
          name: "type",
          description: "Type roles to list.",
          type: 3,
          choices:types,
          required:true
        },
      ],
    },
    {
      name: "log",
      type: 1,
      description: "Config server activation log.",
      options: [
        {
          name:"channel",
          description: "Channel to be server activation log",
          type:"CHANNEL",
          required:true,
          channel_types:[0,5]
        }
      ],
    },
  ],
  cooldown:10,
  run:async(client, interaction,args,guildData)=> {
    let subCommand = interaction.options._subcommand;
    let type1 = interaction.options.getString("type");
    let role = interaction.options.getRole("role");
    let valid = role?.permissions.toArray()?.filter(c => permissions.includes(c)) || []
    if(role?.managed) return interaction.reply({content:`**🙄 - I can't save managed roles.**`})
    if(valid?.length) {
      return interaction.reply({
        content:`**🙄 - I can't save admins roles.**`
      })
    }
    let channel = interaction.options.getChannel("channel");
    let type = type1 === "activated" ? guildData.active.activated : type1 === "temp" ? guildData.active.temp : guildData.active.admins

    if(subCommand === "add"){
      if(type.length > 5) return interaction.reply({
        content:`**🙄 - I can't add more than 5 roles for ${type1}.**`
      })
      if(type.includes(role.id)){
        return interaction.reply({
          content:`**🙄 - @${role.name} is already saved for ${type1}.**`
        })
      }
      if(
        interaction.guild.me.roles.highest.position <= role.position){
        return interaction.reply(`**🙄 - I can't save roles higher than me.**`) 
      }
      type.push(role.id)
      guildData.save()
      return interaction.reply({
        content:`**✅ - @${role.name} saved for ${type1}.**`
      })
    }
    else if(subCommand === "remove"){
      let obj = type.find(c => c===role.id)
      if(!obj) return interaction.reply({content:`**🙄 - I can't find @${role.name} in ${type1} roles**`})
      type.splice(type.indexOf(obj),1)
      guildData.save()
      return interaction.reply({
        content:`**✅ - @${role.name} removed from ${type1}.**`
      })
    }
    else if(subCommand === "list"){
      type = type.filter(c => interaction.guild.roles.cache.get(c));
      let type3 = type1 === "activated" ? "activated" : type1 === "temp" ? "temp" : "admins"
      guildData.active[type3] = type
      guildData.save()
      if(!type.length){
        return interaction.reply({
          content:`**🙄 - I can't find any roles for ${type1} saved.**`
        })
      }
      type = type.map((c,i) => `${++i} - ${interaction.guild.roles.cache.get(c)}`).join("\n")
      let embed = new MessageEmbed()
      .setTitle(`${type1} roles`)
      .setDescription(type)
      .setFooter({text:interaction.guild.name,iconURL:interaction.guild.iconURL()})

      return interaction.reply({embeds:[embed]})
    }
    else if(subCommand === "log"){
      guildData.active.log = channel.id
      await Module.findOneAndUpdate({guildID:interaction.guild.id},{active:guildData.active})
      return interaction.reply({content:`**✅ - #${channel.name} has been choosed for activation logs**`})
    }
  }
}
