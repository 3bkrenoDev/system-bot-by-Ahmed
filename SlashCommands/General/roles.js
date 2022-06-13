const { MessageEmbed } = require("discord.js")
let { splitMessage } = require("../../Functions/utils.js")

module.exports = {
  name:`roles`,
  description: 'Get a list of server roles and member counts.',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  cooldown:20,
  run:async(client, interaction,args) => {
    await interaction.deferReply()
    let rolemap = interaction.guild.roles.cache.sort((a, b) => b.position - a.position);
    let mapped =  rolemap.map(r => `${r} -   ${r.members.size} members`).join("\n"); 
    const split = splitMessage(`${mapped}`,{
      char:"\n",
      maxLength:1950
    })
    let embed = new MessageEmbed()
    .setAuthor({name:interaction.user.username,iconURL: interaction.user.avatarURL({dynamic:true})})
    split.map((s,i) => {
      if(i === 0) embed.setTitle(`Total roles \`${interaction.guild.roles.cache.size}\``)
      else {
        embed.title = null 
        embed.author = {}
      }
      embed.setDescription(s);
      i == 0 ? interaction.editReply({embeds:[embed]}).catch(err=>0) : interaction.channel.send({embeds:[embed]}).catch(err=>0)
    })  
  }
}