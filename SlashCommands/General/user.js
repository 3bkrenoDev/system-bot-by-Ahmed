const { MessageEmbed,MessageActionRow,MessageButton } = require("discord.js")
const moment = require("moment")
module.exports = {
  name:`user`,
  description: 'Shows information, such as ID and join date, about yourself or a user.',
  type: 'CHAT_INPUT',
  options:[
      {
       name:"user",
       description: "target to see his avatar!",
       type:"USER",
       required:false,
     }
  ],
  cooldown:5,
  botperms:["EMBED_LINKS"],
  run:async(client, interaction,args) => {
    const user = interaction.options.getMember("user")|| interaction.member;
    let badges = user.user.flags.toArray().join(", ") || "null"
     var userInvites = (await interaction.guild.invites.fetch()).filter(invite => invite.inviter.id === user.id).map(c => c.uses).reduce((prev, curr) => prev + curr,0)

    var useAmount = userInvites.uses;
    let d = user.presence?.clientStatus || {}
    let device = Object.entries(d).map(value => value[0])?.join(",")
    let embed = new MessageEmbed()
    .addField(`Name`,user.user.username,true)
    .addField(`tag`,user.user.tag,true)
    .addField(`UserId`,user.user.id,true)
    .addField(`joined discord at`, `**\`${moment(user.user.createdTimestamp).format('DD/MM/YYYY h:mm')}\`
${moment(user.user.createdTimestamp).fromNow()}**`, true)
    .addField(`status`,user.presence?.status || "offline",true)
    .addField(`device`,device.length ? device : "offline",true)
    .addField(`badges`, badges,true)
    const button = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setLabel('more info')
        .setStyle('PRIMARY')
        .setCustomId('moreInfo-'+interaction.user.id)
    )
    let perms = user.permissions.toArray().join(", ")
    if(perms.includes("ADMINISTRATOR")) perms = "ADMINISTRATOR"
let embed1 = new MessageEmbed()
    .addField(`joined server at`,`**\`\`${moment(user.joinedAt).format('DD/MM/YYYY h:mm')}\`\`\n${moment(user.joinedTimestamp).fromNow()}**`,true)
  .addField(`nickname`, user.nickname || "none",true)

  .addField(`Invites`,userInvites.toString(),true)
  .addField(`Roles`,user.roles.cache.map(c => c).join(", "),true)
  .addField(`Permissions`,perms,true)
    const filter = (interaction1) => interaction1.isButton() && interaction1.user.id === interaction.user.id && interaction1.message.interaction.id === interaction.id;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        max:1,
        time: 60000      
      })

collector.on('collect', async(collected) => {
  await collected.deferUpdate().catch(er => 0);
  let customId = collected.customId;  
  collected.message.components[0].components[0].disabled = true
  collected.message.components[0].components[0].label = 'Ended'
  await collected.message.edit({embeds:[embed1],components:collected.message.components})
})
    interaction.reply({embeds:[embed],
      components:[button]
    })//.catch(err => 0)
  }
}