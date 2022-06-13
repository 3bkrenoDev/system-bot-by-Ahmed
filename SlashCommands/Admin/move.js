const { MessageEmbed } = require("discord.js")

module.exports = {
  name:`move`,
  description: 'Moves a member to another voice channel.',
  type: 'CHAT_INPUT',
  options:[
      {
        name:"user",
        description: "The user to move.",
        type:"USER",
        required:true,
      },{
        name:"channel",
        description: "Channel to move the user to.",
        type:"CHANNEL",
        required:true,
        channel_types:[2]

      }
    ],
  userPermissions:["MOVE_MEMBERS"],
  botPermissions:["MOVE_MEMBERS"],
  run:async(client, interaction,args) => {
    let target = interaction.options.getMember("user");
    let channel = interaction.options.getChannel("channel");
    if(!target.voice.channel) return interaction.reply(`**🙄 - Member is not in voice channel!**`)
    target.voice.setChannel(channel.id).then(c => {
      return interaction.reply({ content:`**✅  ${user.user.username} moved to ${channel.name}!**`})
    });

  }
}