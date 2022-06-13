const { MessageEmbed } = require("discord.js")
const axios = require("axios");
module.exports = {
  name:`avatar`,
  description: 'Displays server\'s avatar or your avatar or someone else\'s avatar.',
  type: 'CHAT_INPUT',
  options:[
    {
      type:"SUB_COMMAND",
      name:"server",
      description:"see server's avatar",
    },{
      type:"SUB_COMMAND",
      name:"user",
      description:"Displays your avatar or someone else\'s avatar.",
      options:[
        {
          name:"user",
          description: "The user to get avatar for.",
          type:"USER",
          required:false,
        }
      ]
    },
  ],
  cooldown:10,
  botperms:["EMBED_LINKS"],
  run:async(client, interaction,args) => {
    let subCommand = interaction.options._subcommand;
    if(subCommand === "server"){
     
    const mavatar = interaction.guild.iconURL({ format: "png", size: 4096, dynamic: true });
    if(!mavatar) return interaction.reply(`server hasnot image`)
    
const embedm = new MessageEmbed()
            .setAuthor({name:interaction.guild.name,iconURL:mavatar})
            .setTitle(`Avatar Link`)
            .setURL(mavatar)
            .setImage(mavatar)
            .setFooter({text:"Requested by " + interaction.user.tag,iconURL:interaction.user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })})
interaction.reply({embeds:[embedm]})

    }else if(subCommand === "user"){
         const user = interaction.options.getMember("user")|| interaction.member;
    const mavatar = user.user.displayAvatarURL({ format: "png", size: 4096, dynamic: true });
const embedm = new MessageEmbed()
            .setAuthor({name:user.user.tag,iconURL:mavatar})
            .setTitle(`Avatar Link`)
            .setURL(mavatar)
            .setImage(mavatar)
            .setFooter({text:"Requested by " + interaction.user.tag,iconURL:interaction.user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })})
interaction.reply({embeds:[embedm]})
    }

  }
}