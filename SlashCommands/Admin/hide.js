const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "hide",
  description: 'Disables @everyone or someone from seeing the channels.',
  type: 'CHAT_INPUT',
  userPermissions: ["MANAGE_CHANNELS"],
  botPermissions:["MANAGE_CHANNELS","MANAGE_ROLES","EMBED_LINKS"],
  options:[
    {
      name: "all",
      type: 1,
      description: "Disables @everyone or someone from seeing all channels.",
      options: [
        {
          name:"user",
          description: "User to hide channels on him.",
          type:"USER",
          required:false,
        }
      ],
    },
    {
      name: "channel",
      type: 1,
      description: "Disables @everyone or someone from seeing specific channel.",
      options: [
        {
          name:"target",
          description: "Channel to hide.",
          type:"CHANNEL",
          required:false,
          channel_types:[0,5]
        },
        {
          name:"user",
          description: "User to hide specific channel on him.",
          type:"USER",
          required:false,
        }
      ],
    },
  ],
  run: async (client, interaction, args) => {
    let subCommand = interaction.options._subcommand;
    let channel = interaction.options.getChannel("target") || interaction.channel;
    let user = interaction.options.getMember("user");
    if(subCommand === "all"){
      interaction.guild.channels.cache
      .filter(c => c.type !== "GUILD_VOICE" || c.type !== "GUILD_CATEGORY" || c.type !== "GUILD_STAGE_VOICE").forEach(c => {
        c.permissionOverwrites.edit(user ? user.id : interaction.guild.id, {
          VIEW_CHANNEL: false, 
        }).catch(err => 0)
      });
      let msgLock = `**🔒 All channels have been hided${user ? ` for ${user}` : ""}.**`;
      return interaction.reply({content:msgLock});
    }else if(subCommand === "channel"){
      channel.permissionOverwrites.edit(user ? user.id : interaction.guild.id, {
        VIEW_CHANNEL : false
      })
      let msgHide = `**🔒 ${channel} has been hided${user ? ` for ${user}` : ""}.**`;

      interaction.reply({content:msgHide});
    }
  },
};