const { MessageEmbed } = require("discord.js")
const ms = require("ms")
module.exports = {
  name:`untimeout`,
  description: 'Remove timeout from a user',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "The user to untimeout",
      type:"USER",
      required:true,
    },
  ],
  userPermissions:["MODERATE_MEMBERS"],
  botPermissions:["MODERATE_MEMBERS"],
  run:async(client, interaction,args) => {
    let target = interaction.options.getMember("user");
    if(!target)return;
    if(target.permissions.has("ADMINISTRATOR")){
      return interaction.reply({content:`**🙄 -  You can't untimeout @${target.user.username}. **`})
    }
    if(!target.communicationDisabledUntilTimestamp){
      return interaction.reply({content:`❌ Member is not timed out.`})
    }
    target.timeout(0,).then(_ => {
      return interaction.reply({content:`**✅ ${target.user.username} has been untimed out.**`})
    }).catch(err =>  {
      return interaction.reply({content:`🙄 - I couldn't untimeout that user. Please check my permissions and role position.`})
    })

    
  }
}