const { MessageEmbed } = require("discord.js")

module.exports = {
  name:`vkick`,
  description: 'Kicks a member from a voice channel.',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "The user to kick from voice channel.",
      type:"USER",
      required:true,
    }
  ],
  userPermissions:["MOVE_MEMBERS"],
  botPermissions:["MOVE_MEMBERS"],
  run:async(client, interaction,args) => {
    let target = interaction.options.getMember("user");
    if(!target.voice.channel) return interaction.reply(`**🙄 - Member is not in voice channel!**`)
    if (
      target.roles.highest.position >=
      interaction.member.roles.highest.position
      && interaction.guild.ownerId !==  target.id
      && interaction.guild.ownerId !==   interaction.member.id
      || interaction.guild.ownerId ==  target.id
    ){
      return interaction.reply({ content: `🙄 - ** You can't kick ${target.user.username}. **`})
      }
      target.voice.setChannel(null).then(c => {
        return interaction.reply({ content:`✅ **@${target.user.username} kicked from the voice! **`})
      }).catch(err => {
        return interaction.reply({ content:`🙄 - I couldn't kick that user. Please check my permissions.`})
      })

  }
}