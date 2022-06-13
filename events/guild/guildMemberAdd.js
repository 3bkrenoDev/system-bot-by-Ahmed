var guildModel = require("../../DataBase/models/guild.js")
var welcomeFunctions = require("../../Functions/welcome")

module.exports = {
	name: 'guildMemberAdd',
  inviteTracker:true,
  run:async(member, inviter, invite, error,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(!globalBot && member.guild.id !== ID)return;
    let guildData = await guildModel.findOne({
      guildID:member.guild.id
    })
    if(!guildData)return;
    let welcomer = guildData.welcome
    let channel = member.guild.channels.cache.get(welcomer.channel);
    if(!channel)return;
    let owner = member.guild.members.cache.get(member.guild.ownerId)
    var userInvites = (await member.guild.invites.fetch()).filter(invitee => invitee.inviter.id === owner.id).map(c => c.uses).reduce((prev, curr) => prev + curr,0)
    let invites = (error ? userInvites.uses : invite.count) || "Unknown"
    if(!invite?.count || invite?.count === "Unknown") invites = userInvites
    if(error) invites = userInvites || "Unknown"
    let msg = welcomer.message?.replaceAll("[user]",member).replaceAll("[userName]",member.user.username).replaceAll("[memberCount]",member.guild.memberCount).replaceAll("[server]",member.guild.name).replaceAll("[inviter]",error ? owner : inviter).replaceAll("[inviterName]",error ? owner.user.username : inviter.username).replaceAll("[invites]",invites)
    let WelcomeImage = await welcomeFunctions.createWelcomeImage(member,welcomer)
    if(WelcomeImage && welcomer.toggle.image) await channel.send({ files: [WelcomeImage] });
    if(welcomer.toggle.message && msg) channel.send({ content: `${msg}` });
  }
}