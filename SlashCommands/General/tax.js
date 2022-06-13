const { MessageEmbed,MessageActionRow,MessageButton } = require("discord.js")
const { tax } = require ("../../Functions/utils.js")

module.exports = {
  name:`tax`,
  description: 'calculate probot taxes.',
  type: 'CHAT_INPUT',
  options:[
      {
       name:"number",
       description: "the number ?",
       type:"STRING",
       required:true,
     }
  ],
  cooldown:5,
  run:async(client, interaction,args) => {
    let number = interaction.options.getString("number")
    let final = tax(number)
    if(!final) return interaction.reply(`> **type only numbers**`)
    if(final > 10000000000) return interaction.reply("> **Please Put Amount Smaller Than 10 Billion**");
    interaction.reply(`> **You must transfer : ${final}**`)
  
  }
}

