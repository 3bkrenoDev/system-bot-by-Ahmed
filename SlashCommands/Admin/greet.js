const { MessageEmbed,MessageAttachment } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
const ms = require("ms")
module.exports = {
  name: `greet`,
  description: 'Greet announcements.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "channel",
      type: 1,
      description: "set the greet announcements channel.",
      options: [
        {
          name: "channel",
          description: "Channel to set.",
          type: 7,
          channel_types: [0,5],
          required: true

        }
      ],
      required: false
    },
    {
      name: "time",
      type: 1,
      description: "Set the time to delete the message.",
      options: [
        {
          name: "time",
          description: "Time to set.",
          type: 10,
          required: true
        }
      ],
      required: false
    },
    {
      name: "toggle",
      type: 1,
      description: "Enable or disable the greet announcements.",
      required: false
    },
    {
      name: "message",
      type: 1,
      description: "Set the message to send.",
      required: false
    },
    {
      name: "test",
      type: 1,
      description: "Test the greet announcements.",
      required: false
    },
  ],
  cooldown:10,
  userPermissions:["MANAGE_GUILD"],
  run:async(client, interaction,args,guildData) => {
    let subCommand = interaction.options._subcommand;
    if(subCommand === "channel"){
      let channel = interaction.options.getChannel("channel")
      guildData.greet.channel = channel.id;
      guildData.save()
      interaction.reply({ content: `**✅ - #${channel.name} has been choosed for greet channel.**` })
    }
    else if(subCommand === "time"){
      let time = interaction.options.getNumber("time")
      if(time > 60) return interaction.reply({content:`**🙄 - You cannot choose a time greater than 60 seconds.**`})
      guildData.greet.time = time
      guildData.save()
      return interaction.reply({content:`**✅ - Time selected successfully.**`})
    }
    else if(subCommand === "toggle"){
      let toggle = guildData.greet.toggle;
      guildData.greet.toggle = toggle ? false : true
      guildData.save()
      return interaction.reply({ content: `**✅ - greet announcements ${toggle ? "disabled" : "enabled"}.**` })
      
    }
    else if (subCommand === "message") {
      let embed =new MessageEmbed()
      .setAuthor({name:`Now you can insert your message`, iconURL:interaction.user.avatarURL({dynamic: true})})
      .setDescription(`**Some useful words 👇 :
> %user.mention% => User Mention.
> %user.fullname% => Username and tag.
> %user.name% => Username.
> %user.discrim% =>  User tag.
> %user.id% => User ID.**`)
      .setColor('RED')
      .setFooter({text:interaction.guild.name, iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp()
      interaction.reply({embeds:[embed]})
      let filter = (message) => message.author.id === interaction.user.id
      let collector = await interaction.channel.awaitMessages({
        filter,
        time:30000,
        max:1,
        errors:["time"]
      }).then((collected) => {
        let message = collected.first()
        message.delete().catch(err => 0)
        if(message.content.length > 250) return interaction.editReply({content:`**🙄 - The message must be less than 250 characters.**`,embeds:[]})
        guildData.greet.message = message.content
        guildData.save()
        interaction.editReply({content:`**✅ - The changes have been saved.**`,embeds:[]})
    }).catch(err => {
        interaction.editReply({content:`**🙄 - Time's up and you haven't sent your message.**`,embeds:[]})
        
    })
    }
    else if(subCommand === "test"){
      let greet = guildData.greet
      let member = interaction.member
      interaction.reply({
 content:greet.message.replaceAll('%user.mention%',member).replaceAll('%user.fullname%',member.user.tag).replaceAll('%user.name%',member.user.username).replaceAll('%user.discrim%',member.user.discriminator).replaceAll('%user.id%',member.id),fetchReply:true })
      setTimeout(() => {
        interaction.deleteReply().catch(err => 0)
      },greet.time*1000)
    }

  }
}