const { MessageEmbed } = require("discord.js")
const ms = require("ms")
module.exports = {
  name:`timeout`,
  description: 'Timeout a user from sending messages, react or join voice channels.',
  type: 'CHAT_INPUT',
  options:[
    {
      name:"user",
      description: "The user to timeout",
      type:"USER",
      required:true,
    },
    {
      name:"time",
      description: "The duration of timeout",
      type:"NUMBER",
      choices:[
        {
          name:"60 secs",
          value:ms("60s")
        },{
          name:"5 mins",
          value:ms("5m")
        },{
          name:"10 mins",
          value:ms("10m")
        },{
          name:"1 hour",
          value:ms("1h")
        },{
          name:"1 day",
          value:ms("1d")
        },{
          name:"1 week",
          value:ms("7d")
        }
      ],
      required:true,
    },
    {
      name:"reason",
      description: "The reason of timeout.",
      type:"STRING",
      required:false,
    }
  ],
  userPermissions:["MODERATE_MEMBERS"],
  botPermissions:["MODERATE_MEMBERS"],
  run:async(client, interaction,args) => {
    let target = interaction.options.getMember("user");
    if(!target)return;
    let time = interaction.options.getNumber("time");
    let reason = interaction.options.getString("reason") || "No Reason";
    if(target.permissions.has("ADMINISTRATOR")){
      return interaction.reply({content:`**🙄 -  You can't timeout @${target.user.username}. **`})
    }
    target.timeout(time,reason).then(_ => {
      return interaction.reply({content:`**✅ ${target.user.username} has been timed out!**`})
    }).catch(err =>  {
      return interaction.reply({content:`🙄 - I couldn't timeout that user. Please check my permissions and role position.`})
    })

    
  }
}