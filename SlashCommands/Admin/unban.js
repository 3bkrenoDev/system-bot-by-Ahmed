const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unban",
    description: "Unbans a member.",
    type: 'CHAT_INPUT',
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["BAN_MEMBERS"],
    options:[
      {
        name:"input",
        description: "User to remove the ban of.",
        type:"STRING",
        required:true,
      }
    ],
    run: async (client, interaction, args) => {
      let userid = interaction.options.getString("input");
      if(userid.toLowerCase() === "all") {
        if(!interaction.member.permissions.has("ADMINSITRATOR"))return interaction.reply({content:`🙄 - **To unban all members, you must have Administrator permission.**`})
        interaction.guild.bans.fetch().then(c => {
          let users = c.map(cc => cc.user.id)
          interaction.reply(`✅ ${users.length} members are being unbanned.`).catch(err =>0)
          users.map(user => interaction.guild.members.unban(user).catch(err => 0))
        })
        return;
      }
      interaction.guild.members.unban(userid)
      .then((user) => {
        return interaction.reply({
          content: `✅ **${user.username} unbanned!**`
        }).catch(err => 0);  
      }).catch(err => {
        return interaction.reply({content:`🙄 - **I can't find ${userid} in the ban list**`});
      })
  },
};