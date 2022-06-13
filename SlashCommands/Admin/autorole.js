const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
let permissions =["MANAGE_GUILD","MANAGE_CHANNELS","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR"]
let choices = [{name:"Bots",value:"bots"},{name:"Humans",value:"humans"}]

let { splitMessage } = require("../../Functions/utils.js")
module.exports = {
  name:`autorole`,
  description: 'Config server auto roles.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "add",
      type: 1,
      description: "Add roles to give to",
      options: [
        {
          name:"pick_type",
          description: "Pick a type.",
          type:"STRING",
          choices:choices,
          required:true,
        },
        {
          name:"role",
          description: "The role that will be given to.",
          type:"ROLE",
          required:true,
        }
      ],
    },
    {
      name: "remove",
      type: 1,
      description: "Remove roles from auto roles",
      options: [
        {
          name:"pick_type",
          description: "Pick a type",
          type:"STRING",
          choices:choices,
          required:true,
        },
        {
          name:"role",
          description: "The role to remove",
          type:"ROLE",
          required:true,
        }
      ],
    },
    {
      name: "list",
      type: 1,
      description: "List auto roles in the server.",
      options: [
        {
          name:"pick_type",
          description: "Pick a type",
          type:"STRING",
          choices:choices,
          required:true,
        }
      ],
    },
    {
      name: "toggle",
      type: 1,
      description: "Enable or disable the auto roles.",
      options: [
        {
          name:"pick_type",
          description: "Pick a type",
          type:"STRING",
          choices:choices,
          required:true,
        }
      ],
      },
  ],
  cooldown:10,
  userPermissions:["ADMINISTRATOR"],
  run:async(client, interaction,args,guildData) => {
    let subCommand = interaction.options._subcommand;
    let type = interaction.options.getString("pick_type")
    let role = interaction.options.getRole("role")
    let valid = role?.permissions.toArray()?.filter(c => permissions.includes(c)) || []
    if(valid?.length) {
      return interaction.reply({
        content:`**🙄 - I can't save admins roles.**`
      })
    }
    if(subCommand === "add"){
      if(interaction.guild.me.roles.highest.position <= role.position || role.managed){
        return interaction.reply(`**I can't save this role**`) 
      }
      let already =  type === "humans" ? guildData.autoRoles.humans.roles : guildData.autoRoles.bots.roles
      if(already.includes(role.id)) return interaction.reply(`**🙄 - @${role.name} is already saved for ${type} roles.**`)
      already.push(role.id)
      guildData.save()
      return interaction.reply(`**✅ - @${role.name} saved for ${type} roles.**`)
    }
    if(subCommand === "remove"){
      let already =  type === "humans" ? guildData.autoRoles.humans.roles : guildData.autoRoles.bots.roles
      if(!already.includes(role.id)) return interaction.reply(`**🙄 - I can't find @${role.name} in ${type} roles**`)
        already.splice(already.indexOf(already.find(c => c ===role.id)),1)
        guildData.save()
        return interaction.reply(`**✅ - @${role.name} removed from ${type}.**`)
    }
    if(subCommand === "toggle"){
      let toggle =  guildData.autoRoles[type].toggle
      toggle = toggle ? false : true
      guildData.autoRoles[type].toggle = toggle
      guildData.save()
      return interaction.reply({ content: `**✅ - ${type} autorole toggle has been ${toggle ? "Disabled" : "Enabled"}.**` })
    }
    if(subCommand === "list"){
      await interaction.deferReply()
      let roles = guildData.autoRoles[type].roles
      roles = roles.filter(c => interaction.guild.roles.cache.get(c));
      guildData.autoRoles[type].roles = roles
      guildData.save();
      let data = roles.map((c,i) => {
        let role = interaction.guild.roles.cache.get(c)
        return `${++i} - ${role}`
      }).join("\n")
      let split = splitMessage(`**${data.length ? data : "Nothing to show."}\n**`,{
      char:"\n",
      maxLength:1950
      })
      split.map(async(c,i) => {
        let embed = new MessageEmbed()
          .setTitle(`${type}`)
          .setTitle(`Auto-Roles for ${type}`)        .setFooter({text:interaction.guild.name,iconURL:interaction.guild.iconURL()})
        .setDescription(c)
        if(i === 0) interaction.editReply({embeds:[embed]}) 
        else interaction.channel.send({embeds:[embed]})
      })
    }      
  }
}