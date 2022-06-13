const Discord = require("discord.js")
let words = require("../../json/games/cutTweet.json")
module.exports = {
  name:`cuttweet`,
  description: 'CutTweet on the quick.',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  run:async(client, interaction,args,guildData) => {
    let word = words[Math.floor(Math.random() * words.length)];
    let embed = new Discord.MessageEmbed() .setAuthor({name:interaction.user.username,iconURL:interaction.user.avatarURL()})
    .setDescription(word)
    .setFooter({text:interaction.guild.name})
    return interaction.reply({embeds:[embed]})
  }
}