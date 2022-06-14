const { MessageEmbed } = require("discord.js")
let { splitMessage } = require("../../Functions/utils.js")

module.exports = {
  name:`help`,
  description: 'Feeling lost?',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  cooldown:5,
  run:async(client, interaction,args) => {
    let commands = client.slashCommands.map(command =>
      `**● | /${command.name}** - **${command.description}**`).join("\n")

    let embed = new MessageEmbed()
    .setTitle(`Help Menu`) // By Ahmed Abd El-Latif Gaming
    .setAuthor({name:`${interaction.user.tag}`,
     iconURL:interaction.user.avatarURL()})
    .setColor(`RED`)
    .setThumbnail(client.user.avatarURL())
    .setTimestamp()
    .setFooter({text:`This Bot Made By Ahmed Abd El-Latif Gaming`});
    let split = splitMessage(`${commands}\n`,{
      char:"\n",
      maxLength:1950
    })
    split.map((s,i) => {
      embed.setDescription(s)
      i == 0 ? interaction.reply({embeds:[embed]}).catch(err=>0) : interaction.channel.send({embeds:[embed]}).catch(err=>0)
      })  
  }
}
