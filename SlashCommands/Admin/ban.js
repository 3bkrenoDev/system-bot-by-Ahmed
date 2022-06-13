const { MessageEmbed } = require("discord.js")

module.exports = {
  name:`ban`,
  description: 'Bans a member.',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "User to ban.",
      type:"USER",
      required:true,
    },{
      name:"reason",
      description: "The reason of the ban.",
      type:"STRING",
      required:false,
    }
  ],
  userPermissions:["BAN_MEMBERS"],
  botPermissions:["BAN_MEMBERS"],
  run:async(client, interaction,args) => {
    let target = interaction.options.getMember("user");
    if(!target) return;
    let reason = interaction.options.getString("reason") || "No Reason";
    if (
      target.roles.highest.position >=
      interaction.member.roles.highest.position
      && interaction.guild.ownerId !==  target.id
      &&  interaction.guild.ownerId !== interaction.member.id
      || interaction.guild.ownerId ==  target.id 
    ){
      return interaction.reply({ content: `🙄 - ** You can't ban @${target.user.username}. **`})
    }
    if(!target.bannable){
return interaction.reply({ content: `🙄 - I couldn't ban that user. Please check my permissions and role position.`})
    }
    target.ban({reason: reason}).then(c => {
      return interaction.reply({ content:`✅ **${target.user.username} banned from the server! ✈️** `})
    }).catch(err => 0);

  }
}