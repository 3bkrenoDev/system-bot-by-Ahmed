const { MessageEmbed } = require("discord.js")
const ms = require("ms")
const Module = require("../../DataBase/models/guild.js")
const { setLongTimeout } = require("../../Functions/utils.js")
module.exports = {
  name:`mute`,
  description: 'Mute a member from text/voice channels so they cannot type.',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "User to mute.",
      type:"USER",
      required:true,
    },{
      name:"time",
      description: "Time duration for the mute.",
      type:"STRING",
      required:false,
    },{
      name:"reason",
      description: "Reason of the mute.",
      type:"STRING",
      required:false,
    }
  ],
  userPermissions: ["MUTE_MEMBERS"],
  botPermissions:["MANAGE_ROLES"],
 run:async(client,interaction,args,guildData) => {
    
    let target = interaction.options.getMember("user");
    let reason = interaction.options.getString("reason") || "No Reason Provided";
    let time = interaction.options.getString("time") || "7d";
    if(!ms(time)) time = "7d";
    let role = interaction.guild.roles.cache.find(ro => ro.name == 'Muted');
    if(!role) {
      role = await interaction.guild.roles.create({
        name: 'Muted',
        permissions: [],              
      })
    }
    if (target.roles.cache.has(role.id)) {
      return interaction.reply({content:`**🙄 - ${target.user.username} is already muted**`}); 
    }
    if (
      target.roles.highest.position >=
      interaction.member.roles.highest.position
      && interaction.guild.ownerId !==  target.id
      &&  interaction.guild.ownerId !== interaction.member.id
      || interaction.guild.ownerId ==  target.id
    ){
      return interaction.reply({ content: `🙄 - ** You can't mute @${target.user.username}. **`})
    }
    if(interaction.guild.me.roles.highest.position <= role.position){
  return interaction.reply({
    content:`🙄 - I couldn't change the roles for that user. Please check my permissions and role position.`
  })
}
    let obj = {
      userID:target.id,
      roleID:role.id,
      time:ms(time) + Date.now(),
    }
    let oldObj = guildData.muted.find(c => c.userID===target.id)
    if(!oldObj){
      guildData.muted.push(obj)
      guildData.save()
    }else {
      guildData.muted[guildData.muted.indexOf(oldObj)] = obj
       await Module.findOneAndUpdate({guildID:interaction.guild.id},{muted:guildData.muted})
    }
    interaction.guild.channels.cache
    .filter(c => c.type !== "GUILD_VOICE" || c.type !== "GUILD_CATEGORY" || c.type !== "GUILD_STAGE_VOICE").forEach(c => {
      c.permissionOverwrites.edit(role.id , {
        SEND_MESSAGES: false, 
        ADD_REACTIONS: false
      }).catch(err => 0)
    });
    target?.roles.add(role?.id).then(c => {
      setLongTimeout(async() => {
        let newData = await Module.findOne({guildID:interaction.guild.id}) 
        if(!newData || !newData.muted.length)return;
        let newobj = newData.muted.find(c => c.userID === target.id)
        if(!newobj)return; 
        target.roles.remove(newobj.roleID).catch(err => 0)
        newData.muted.splice(newData.muted.indexOf(newobj),1)
        newData.save().catch(err => 0)
      },ms(time))
      return interaction.reply(`✅ **@${target.user.username} muted from the text! 🤐**`)
    }).catch(err => 0)
  }
}