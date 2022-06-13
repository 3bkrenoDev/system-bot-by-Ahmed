const { MessageEmbed } = require("discord.js")

module.exports = {
  name:`help`,
  description: 'Feeling lost?',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  cooldown:5,
  run:async(client, interaction,args) => {
    let commands = client.slashCommands.map(c => `\`${c.name}\``)
    let embed = new MessageEmbed()
    .setDescription(commands.join(", "))
    interaction.reply({embeds:[embed]}).catch(err => 0)
  }
}