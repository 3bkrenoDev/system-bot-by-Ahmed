const { MessageEmbed } = require("discord.js")
const moment = require("moment")

module.exports = {
  name:`server`,
  description: 'Shows information about the server.',
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  cooldown:35,
  run:async(client, interaction,args) => {
    let members = interaction.guild.memberCount;
    let server = interaction.guild;
    var onlineCount = 
interaction.guild.members.cache.filter(m => m.presence?.status === 'online' || m.presence?.status === 'dnd' || m.presence?.status === 'idle').size
var premiumSubscriptionCount = interaction.guild.premiumSubscriptionCount;

let textChannels = interaction.guild.channels.cache.filter(r => r.type === "GUILD_TEXT").size;

let voiceChannels = interaction.guild.channels.cache.filter(r => r.type === "GUILD_VOICE").size;
let allChannels = voiceChannels + textChannels

const verificationLevels = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];

const verificationLevel = interaction.guild.verificationLevel;

const roles = interaction.guild.roles.cache.size;

var embed = new MessageEmbed() 

.setAuthor({name:`${interaction.guild.name}`,iconURL:interaction.guild.iconURL({dynamic : true})})

.setColor("BLACK") 

.addField("**🆔 Server ID:**", `${interaction.guild.id}`,true) 

.addField("**📆 Created On**", 
`${moment(server.createdTimestamp).format('DD/MM/YYYY h:mm')}\n${moment(server.createdTimestamp).fromNow()}`,true)

.addField("**👑 Owned by**", `<@!${interaction.guild.ownerId}>`, true) 

.addField(`**👥  Members (${members})**`, `**${onlineCount}** Online\n**${premiumSubscriptionCount}** Boosts ✨`,true)

 .addField(`**💬 Channels (${allChannels})**`, `**${textChannels}** Text | **${voiceChannels}** Voice`,true)

 .addField(`**🌍 Others**`,`**Verification Level:** ${
   verificationLevels.indexOf(verificationLevel)
   }`, true) 

   .addField(`**🔐 Roles (${roles})**`,`To see a list with all roles use **/roles**` ,true)
    interaction.reply({embeds:[embed]}).catch(err => 0)
  }
}