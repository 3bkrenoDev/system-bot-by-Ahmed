const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
const Functions = require ("../../Functions/utils.js")
module.exports = {
  name:`autoreaction`,
  description: 'Config server auto reaction channels.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "add",
      type: 1,
      description: "add auto reaction channels.",
      options: [
        {
          name: "channel",
          description: "Channel to add.",
          type:"CHANNEL",
          required:true,
          channel_types:[0,5]
        },
        {
          name: "emoji",
          description: "Emojis to add.",
          type: 3,
          required:true
        }
      ],
      required: false
    },
    {
      name: "remove",
      type: 1,
      description: "Remove auto reaction channels.",
      options: [
        {
          name: "channel",
          description: "channel to remove.",
          type:"CHANNEL",
          required:true,
          channel_types:[0,5]
        },
      ],
      required: false
    },
    {
      name: "list",
      type: 1,
      description: "List auto reaction emojis in channel.",
      options: [
        {
          name: "channel",
          description: "Channel to see emojis in.",
          type:"CHANNEL",
          required:true,
          channel_types:[0,5]
        },
      ],
      required: false
    },
  ],
  cooldown:10,
  userPermissions:["MANAGE_GUILD"],
  run:async(client, interaction,args,guildData) => {
    let subCommand = interaction.options._subcommand;
    let channel = interaction.options.getChannel("channel")
    if(subCommand === "add"){
      let emoji = interaction.options.getString("emoji")
      let emojis = Functions.isEmoji(emoji)
      if(!emojis.length){
        return interaction.reply({content:`**🙄 - please provide some valid emojis.**`})
      }
      if(emojis.length > 5) return interaction.reply({content:`**🙄 - i can't add more than 5 emojis.**`})
      let oldObj = guildData.autoReactionChannel.find(c => c.channelId === channel.id)
      let obj = {
        channelId: channel.id,
        emojis:emojis
      }
        if(!oldObj){
          guildData.autoReactionChannel.push(obj)
          guildData.save()
        }else {
          obj.emojis = [...new Set(obj.emojis.concat(oldObj.emojis))]
          let final = obj.emojis.filter(c => c.length > 2 ? client.emojis.cache.get(c) ? c : null : c)
         if(final.length > 5) return  interaction.reply({content:`**🙄 - I can't set more than 5 emojis per channel.`})
          obj.emojis = final
           guildData.autoReactionChannel[guildData.autoReactionChannel.indexOf(oldObj)] = obj
       await Module.findOneAndUpdate({guildID:interaction.guild.id},{autoReactionChannel:guildData.autoReactionChannel}) 
       }
      return interaction.reply(`**✅ - The emojis have been added for #${channel.name}.**`)
    }
    else if(subCommand === "remove"){
      let obj = guildData.autoReactionChannel.find(c => c.channelId === channel.id)
      if(!obj) return interaction.reply({content:`**🙄 - I can't find #${channel.name} in the auto-reaction channels.**`})
      guildData.autoReactionChannel.splice(obj,0)
    guildData.autoReactionChannel.splice(guildData.autoReactionChannel.indexOf(obj),1)
      guildData.save();
      interaction.reply({content:`**✅ - #${channel.name} removed.**`})
    }
    else if(subCommand === "list"){
      let channels = guildData.autoReactionChannel;
      channels = channels.filter(c => client.channels.cache.get(c.channelId));
      guildData.autoReactionChannel = channels
      guildData.save();
      let obj = guildData.autoReactionChannel.find(c => c.channelId === channel.id)
      let anotherChannels   = guildData.autoReactionChannel.map(c => `<#${c.channelId}>`)
if(!obj) return interaction.reply(`**🙄 - There is no emojis here, ${anotherChannels.length ? `check there ${anotherChannels.join("\n")}` : "And there is no data for server"}.**`)


      let embed = new MessageEmbed()
        .setTitle(`Auto-lines Channels`)
        .setDescription(`**the emojis in #${channel.name} are : ⤵️**`)
        .setFooter({text:interaction.guild.name,iconURL:interaction.guild.iconURL()})
   const message = await interaction.reply({embeds:[embed],fetchReply: true})
   for(let i =0; i < obj.emojis.length; i++){
    message.react(obj.emojis[i]).catch(err => {
      if(err.message.includes("Unknown Emoji")){
        obj.emojis.splice(
          obj.emojis.indexOf(obj.emojis[i]),1
        )
      }
    })
    if(i === obj.emojis.length -1 ){
      setTimeout(async() => {
        guildData.autoReactionChannel
          [guildData.autoReactionChannel.indexOf(obj)] 
        = obj
        await Module.findOneAndUpdate({guildID:interaction.guild.id},{autoReactionChannel:guildData.autoReactionChannel})
              },2000*i)
            }
          }
    }
  }
}