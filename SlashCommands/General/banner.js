const { MessageEmbed } = require("discord.js")
const axios = require("axios");
module.exports = {
  name:`banner`,
  description: 'Displays server\'s banner or your banner or someone else\'s banner.',
  type: 'CHAT_INPUT',
  options:[
    {
      type:"SUB_COMMAND",
      name:"server",
      description:"see server's banner",
    },{
      type:"SUB_COMMAND",
      name:"user",
      description:"Displays your banner or someone else\'s banner.",
      options:[
        {
          name:"user",
          description: "The user to get banner for.",
          type:"USER",
          required:false,
        }
      ]
    },
  ],
  cooldown:10,
  run:async(client, interaction,args) => {
    let subCommand = interaction.options._subcommand;
    if(subCommand === "server"){
      let banner = interaction.guild.bannerURL({
      size: 4096
    })
    if(banner){
  interaction.reply({content:banner})
    }else return interaction.reply(`server hasn't banner`)
    }else if(subCommand === "user"){
      const test = interaction.options.getMember("user")|| interaction.member;
      let banner = await getUserBannerUrl(test.id,{
        size: 4096
      })
      if(banner){
        interaction.reply({content:banner})
      }else return interaction.reply(`user hasn't banner`)
    
  }

async function getUserBannerUrl(userId, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
    if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
        size = 4096;
    }
    if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
        defaultFormat = "webp";
    }
    const user = await client.api.users(userId).get();
    if (!user.banner) return null;
    const query = `?size=${size}`;
    const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;
    if (dynamicFormat) {
        const { headers } = await axios.head(baseUrl);
        if (headers && headers.hasOwnProperty("content-type")) {
            return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
        }
    }
    return baseUrl + `.${defaultFormat}` + query;
}
  }
}