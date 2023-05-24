const { MessageEmbed } = require("discord.js")
let formats = ["png", "jpg", "gif"]
const Module = require("../../DataBase/models/guild.js")
const axios = require("axios")

module.exports = {
  name: `autoline`,
  description: 'Config server auto line channels.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "add",
      type: 1,
      description: "add auto line channels.",
      options: [
        {
          name: "channel",
          description: "channel to add.",
          type: 7,
          required: true,
          channel_types: [0, 5]
        },
        {
          name: "line",
          description: "line to add.",
          type: 11,
          required: true,
        }
      ],
    },
    {
      name: "remove",
      type: 1,
      description: "remove auto line channels.",
      options: [
        {
          name: "channel",
          description: "channel to remove.",
          type: "CHANNEL",
          required: true,
          channel_types: [0, 5]
        },
      ],
    },
    {
      name: "list",
      type: 1,
      description: "List auto line channels in the server.",
    },
  ],
  cooldown: 10,
  userPermissions: ["MANAGE_GUILD"],
  run: async (client, interaction, args, guildData) => {
    let subCommand = interaction.options._subcommand;
    let channel = interaction.options.getChannel("channel")
    if (subCommand === "add") {
      if (guildData.autoLinesChannel.length > 5) {
        return interaction.reply({
          content: `**🙄 - I can't add more than 5 channels**`
        })
      }
      let oldObj = guildData.autoLinesChannel.find(c => c.channelId === channel.id)
      let pic = interaction.options.getAttachment("line")
      let nameArray = pic.name.split('.');
      let attEx = nameArray[nameArray.length - 1]
      if (!formats.includes(attEx)) {
        return interaction.reply({
          content: `**🙄 - You can only upload files of this type ${formats}**`
        });
      }
      let obj = {
        channelId: channel.id,
        line: pic.url
      }
      if (!oldObj) {
        guildData.autoLinesChannel.push(obj)
        guildData.save()
      } else {
        guildData.autoLinesChannel[guildData.autoLinesChannel.indexOf(oldObj)] = obj
        await Module.findOneAndUpdate({ guildID: interaction.guild.id }, { autoLinesChannel: guildData.autoLinesChannel })
      }
      return interaction.reply({
        content: `**✅ - The line has been set for #${channel.name}**`, files: [pic]
      })
    }
    else if (subCommand === "remove") {
      let obj = guildData.autoLinesChannel.find(c => c.channelId === channel.id)
      if (!obj) return interaction.reply({ content: `**🙄 - I can't find #${channel.name} in the auto-line channels**` })
      guildData.autoLinesChannel.splice(
        guildData.autoLinesChannel.indexOf(obj), 1)
      guildData.save();
      return interaction.reply({ content: `**✅ - #${channel.name} removed.**` })
    }
    else if (subCommand === "list") {
      try {
        let channels = guildData.autoLinesChannel;
        channels = channels.filter(c => client.channels.cache.get(c.channelId));
        guildData.autoLinesChannel = channels
        guildData.save();
        channels = channels
          .map((c, i) => {
            return `${++i} - <#${c.channelId}>`
          })
        let embed = new MessageEmbed()
          .setTitle(`Auto-lines Channels`)
          .setDescription(channels.length ? channels.join("\n") : "none")
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        return interaction.reply({ embeds: [embed] })
      } catch (err) {
        console.log(err.stack, 1)
      }


    }
  }
}
