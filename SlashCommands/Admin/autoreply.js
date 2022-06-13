const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
let { splitMessage } = require("../../Functions/utils.js")

module.exports = {
  name:`autoreply`,
  description: 'Config server auto replies.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "add",
      type: 1,
      description: "add auto replies in the server.",
      options: [
        {
          name: "trigger",
          description: "the word to be responded",
          type: 3,
          required:true
        },
        {
          name: "response",
          description: "the response to to the trigger",
          type: 3,
          required:true
        },
        {
          name:"embed",
          description: "set the response in the embed.",
          type:"BOOLEAN",
          required:true,
        },
        {
          name:"inline-reply",
          description: "set the response in the inline reply.",
          type:"BOOLEAN",
          required:true,
        },
        {
          name:"delete-trigger",
          description: "delete the trigger affter responded.",
          type:"BOOLEAN",
          required:true,
        },  
      ],
      required: false
    },
    {
      name: "remove",
      type: 1,
      description: "remove auto replies from the server.",
      options: [
        {
          name: "target",
          description: "the reply's position.",
          type: 10,
          required:true
        },
      ],
      required: false
    },
    {
      name: "list",
      type: 1,
      description: "List auto replies in the server.",
      required: false
    },
  ],
  cooldown:10,
  userPermissions:["MANAGE_GUILD"],
  run:async(client, interaction,args,guildData) => {
    let subCommand = interaction.options._subcommand;
    if(subCommand === "add"){
      let trigger = interaction.options.getString("trigger")
      let embed = interaction.options.getBoolean("embed")
      let inline_reply = interaction.options.getBoolean("inline-reply")
      let delete_trigger = interaction.options.getBoolean("delete-trigger")

      let response = interaction.options.getString("response")
      if(trigger.length > 50 || response.length > 50) return interaction.reply(`**🙄 - I can't add more than 50 characters for the trigger or the response .**`)
      let obj = {
        trigger:trigger.trim(),
        response:response,
        embed:embed,
        inline_reply:inline_reply,
        delete_trigger:delete_trigger
      }
      let obj1 = guildData.autoReply?.find(c => c.trigger.toLowerCase() === trigger.toLowerCase())
      if(obj1) return interaction.reply(`**🙄 - ${trigger} is already saved.**`)
      guildData.autoReply.push(obj)
      guildData.save()
      interaction.reply(`**✅ - ${trigger} has been saved.**`)
    }
    if(subCommand === "remove"){
      let target = interaction.options.getString("target")
      let obj = guildData.autoReply[target-1]
      if(!obj) return interaction.reply(`**🙄 - I can't find index ${target} auto-reply**`)
guildData.autoReply.splice(guildData.autoReply.indexOf(obj),1)
      guildData.save()
      interaction.reply(`**✅ - ${obj.trigger} removed.**`)
    }
    if(subCommand === "list"){
      if(!guildData.autoReply.length) return interaction.reply(`**🙄 - I can't find any reply in the server.**`)
        await interaction.deferReply().catch(Err => console.log(Err))
      let obj = guildData.autoReply.map((c,i) => `${c.trigger.replace(/\`/g, "\\`")} -> ${c.response} [${++i}]`).join("\n")
      let split = splitMessage(`${obj}\n`,{
        char:"\n",
        maxLength:1950
      })
      split.map((s,i) => {
        let sended = `**${split[i]}**`;
        let embed = new MessageEmbed()
        .setTitle(`Auto replies`)
        .setDescription(sended)
      .setFooter({text:interaction.guild.name,iconURL:interaction.guild.iconURL()})
        i == 0 ? interaction.editReply({embeds:[embed]}).catch(err=>0) : interaction.channel.send({embeds:[embed]}).catch(err=>0)
      }) 
    }      
  }
}