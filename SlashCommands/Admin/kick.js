const { MessageEmbed } = require("discord.js")

module.exports = {
  name:`kick`,
  description: 'Kicks a member.',
  type: 'CHAT_INPUT',
  options:[
      {
        name:"user",
        description: "The user to kick.",
        type:"USER",
        required:true,
      },{
        name:"reason",
        description: "Reason of the kick.",
        type:"STRING",
        required:false,
      }
    ],
  userPermissions: ["KICK_MEMBERS"],
  botPermissions:["KICK_MEMBERS"],
  run:async(client, interaction,args) => {
    

const target = interaction.options.getMember("user");
    if(!target) return;
      const reason = interaction.options.getString("reason") || "No Reason";
      if (
      target.roles.highest.position >=
      interaction.member.roles.highest.position
      && interaction.guild.ownerId !==  target.id
      && interaction.guild.ownerId !== interaction.member.id
      || interaction.guild.ownerId ==  target.id
      
    ){
      return interaction.reply({ content: `🙄 - ** You can't kick @${target.user.username}. **`})
       }

       if (!target.kickable){
return interaction.reply({ content: `🙄 - I couldn't kick that user. Please check my permissions and role position.`})
         }
         target.kick({reason: reason}).then(c => {
           return interaction.reply({ content:`✅ **@${target.user.username} kicked from the server! **`})
         }).catch(err => 0)

  }
}