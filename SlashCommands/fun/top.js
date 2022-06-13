const { MessageEmbed } = require("discord.js")
module.exports = {
  name:`top`,
  description: 'To display the top 10 people with points on the server.',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  run:async(client, interaction,args,guildData) => {
    let sorted = guildData.funPoints.sort((a,b) => b.points - a.points).slice(0,10).map((c,i) => `#${++i} I <@!${c.userID}> [\`${c.points}\`]${i === 1 ? " 🎖️" : ""}`);
    let embed = new MessageEmbed()
    .setAuthor({name:`افضل عشر لاعبين في سيرفر ${interaction.guild.name}`})
    .setDescription(`**${sorted.join("\n")}**`)
    .setColor("BLACK")
    .setFooter({text:client.user.username,
    iconURL:client.user.avatarURL()})
    return interaction.reply({embeds:[embed]})
    
    
    
  }
}