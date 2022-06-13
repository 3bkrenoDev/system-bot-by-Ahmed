const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "lock",
  description: `Disables @everyone or someone from sending messages in channels.`,
  type: 'CHAT_INPUT',
  options:[
    {
      name: "all",
      type: 1,
      description: "Disables @everyone or someone from sending messages in all channels.",
      options: [
        {
          name:"user",
          description: "User to lock channels on him.",
          type:"USER",
          required:false,
        }
      ],
    },
    {
      name: "channel",
      type: 1,
      description: "Disables @everyone or someone from sending messages in specific channel.",
      options: [
        {
          name:"target",
          description: "Channel to lock.",
          type:"CHANNEL",
          required:false,
          channel_types:[0,5]
        },
        {
          name:"user",
          description: "User to lock specific channel on him.",
          type:"USER",
          required:false,
        }
      ],
    },
  ],
  userPermissions: ["MANAGE_CHANNELS"],
  botPermissions:["MANAGE_CHANNELS","MANAGE_ROLES","EMBED_LINKS"],
  run: async (client, interaction, args) => {
    let subCommand = interaction.options._subcommand;
    let channel = interaction.options.getChannel("target") || interaction.channel;
    let user = interaction.options.getMember("user");
    if(subCommand === "all"){
      interaction.guild.channels.cache
      .filter(c => c.type !== "GUILD_VOICE" || c.type !== "GUILD_CATEGORY" || c.type !== "GUILD_STAGE_VOICE")
      .forEach(c => {
        c.permissionOverwrites.edit(user ? user.id : interaction.guild.id, {
          SEND_MESSAGES: false, 
        }).catch(err => 0)
      });
      let msgLock = `**🔒 All channels have been locked${user ? ` for ${user}` : ""}.**`;
      return interaction.reply({content:msgLock});
    }else if(subCommand === "channel"){
      channel.permissionOverwrites.edit(user ? user.id : interaction.guild.id, {
        SEND_MESSAGES: false
      });
      let msgLock = `**🔒 ${channel} has been locked${user ? ` for ${user}` : ""}.**`;
      return interaction.reply({content:msgLock});
    }
    },
};