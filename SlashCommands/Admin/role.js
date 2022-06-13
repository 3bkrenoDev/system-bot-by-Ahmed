const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "role",
  description: "Add\/remove a role(s) for a user.",
  type: 'CHAT_INPUT',
  userPermissions: ["MANAGE_ROLES"],
  botPermissions:["MANAGE_ROLES"],
  options:[
    {
      type:"SUB_COMMAND",
      name:"give",
      description:"Gives a role to a user.",
      options:[
        {
          name:"user",
          description: "User to give role for.",
          type:"USER",
          required:true,
        },{
          name:"role",
          description: "The role to give.",
          type:"ROLE",
          required:true,
        }
      ]
    },
    {
      type:"SUB_COMMAND",
      name:"remove",
      description:"Removes a role to a user.",
      options:[
        {
          name:"user",
          description: "User to remove role for.",
          type:"USER",
          required:true,
        },{
          name:"role",
          description: "The role to remove.",
          type:"ROLE",
          required:true,
        }
      ]
    },
    {
      type:"SUB_COMMAND",
      name:"multiple",
      description:"Give / remove multiple users from a role.",
      options:[
        {
          name:"pick_type",
          description: "Pick a type",
          type:"STRING",
          choices:[
            {
              name:"All",
              value:"all"
            },{
              name:"Bots",
              value:"bots"
            },{
              name:"Humans",
              value:"humans"
            }
          ],
          required:true,
        },
        {
          name:"give_or_remove",
          description: "Pick a type",
          type:"STRING",
          choices:[
            {
              name:"Give",
              value:"give"
            },{
              name:"Remove",
              value:"remove"
            }
          ],
          required:true,
        },
        {
          name:"role",
          description: "The role to give / remove.",
          type:"ROLE",
          required:true,
        }
      ]
    }  
  ],
  run: async (client,interaction,args) => {
    let typesubcommand = interaction.options._subcommand;
    let target = interaction.options.getMember("user");
    let role = interaction.options.getRole("role");
    if(role?.managed)return  interaction.reply(`🙄 - **${role}** is managed by integration and can't be given.`);
    if(interaction.guild.me.roles.highest.position <= role?.position)return interaction.reply(`🙄 - I couldn't change the roles for that user. Please check my permissions and role position.`);
    if (interaction.member.roles.highest.position <= role?.position && interaction.guild.ownerId !== interaction.member.id) return interaction.reply(`🙄 - **${role}**'s position higher than yours.`);
    if(typesubcommand === "give"){
      let embed = new MessageEmbed()
      .setDescription(`✅ Changed roles for ${target.user.username}, **+${role.name}**`)
      .setColor("GREEN")
      target.roles.add(role.id).then(() =>{
        return interaction.reply({embeds:[embed]})
      }).catch(err => {
        return interaction.reply(`🙄 - I can't find the role **${role}**.`)
      })
    }
    else if(typesubcommand === "remove"){
      let embed = new MessageEmbed()
      .setDescription(`✅ Changed roles for ${target.user.username}, **-${role.name}**`)
      .setColor("GREEN")
      target.roles.remove(role.id).then(() =>{
        return interaction.reply({embeds:[embed]})
      }).catch(err => {
        return interaction.reply(`🙄 - I can't find the role **${role}**.`)
       })
    }
    else if(typesubcommand === "multiple"){
      let embed = new MessageEmbed()
      .setColor("#DC143C")
      if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[embed.setDescription(`**🙄 - You must have Administrator permission to do this command.**`)]})
      
      let typepick = interaction.options.getString("pick_type")
      let typeaction = interaction.options.getString("give_or_remove");
      await interaction.guild.members.fetch().catch(err => 0)
      if(typepick === "all"){
        if(typeaction === "give"){
          let members = interaction.guild.members.cache.filter(c => !c.roles.cache.has(role.id));
          embed.setDescription(`✅ Changing roles for ${members.size} members, +${role.name}`)
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.add(role.id).catch(err => 0)
          })
        }
        else if(typeaction === "remove"){
          let members = role.members.filter(c => c.roles.cache.has(role.id))
          embed.setDescription(`✅ Changing roles for ${members.size} members, -${role.name}`)
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.remove(role.id).catch(err=>0)
          })
        }
      }
      else if(typepick === "humans"){
        if(typeaction === "give"){
          let members = interaction.guild.members.cache.filter(c => !c.user.bot && !c.roles.cache.has(role.id));
          embed.setDescription(`✅ Changing roles for ${members.size} members, +${role.name}`)
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.add(role.id).catch(err=>0)
          })
        }
        else if(typeaction === "remove"){
          let members = interaction.guild.members.cache.filter(c => !c.user.bot && c.roles.cache.has(role.id)); 
  embed.setDescription(`✅ Changing roles for ${members.size} members, -${role.name}`)
 
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.remove(role.id).catch(err=>0)
          })
        }
      }
      else if(typepick === "bots"){
        if(typeaction === "give"){
          let members = interaction.guild.members.cache.filter(c => c.user.bot && !c.roles.cache.has(role.id));
          embed.setDescription(`✅ Changing roles for ${members.size} members, +${role.name}`)
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.add(role.id).catch(err=>0)
          })
        }
        else if(typeaction === "remove"){
          let members = interaction.guild.members.cache.filter(c => c.user.bot && c.roles.cache.has(role.id)); 
          embed.setDescription(`✅ Changing roles for ${members.size} members, -${role.name}`)
          interaction.reply({embeds:[embed]})
          members.forEach(async member => {
            await member.roles.remove(role.id).catch(err=>0)
          })
        }
      }
     }   
    },
};