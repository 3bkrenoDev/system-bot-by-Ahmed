const { Client, CommandInteraction,MessageEmbed } = require("discord.js");
let { splitMessage } = require("../../Functions/utils.js")

module.exports = {
  name: "bots",
  description: "gets all server's bots",
  type: 'CHAT_INPUT',
  botperms:["EMBED_LINKS"],
  cooldown:10,
  run: async (client, interaction, args) => {
    await interaction.deferReply().catch(Err => console.log(Err))
    let botssize = interaction.guild.members.cache.filter(m=> m.user.bot)
  .map(m=> `<@${m.id}> [ ${m.user.username} ]
    **ID :** \`${m.id}\``).join('\n \━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\━\ \n');
    let split = splitMessage(`${botssize}\n`,{
      char:"\n",
      maxLength:1950
    })
    split.map((s,i) => {
      let sended = split[i].toString();
      i == 0 ? interaction.editReply({content:sended}).catch(err=>0) : interaction.channel.send({content:sended}).catch(err=>0)
      })  
           
    },
};
