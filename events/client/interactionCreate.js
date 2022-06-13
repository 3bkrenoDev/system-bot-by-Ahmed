const Discord = require('discord.js');  
var guildModel = require("../../DataBase/models/guild.js")
const cooldowns = new Discord.Collection();

module.exports = {
	name: 'interactionCreate',
  run:async(interaction,client)=> {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if(interaction.user.bot || (!globalBot && interaction.guild.id !== ID)) return;
    let cooldownGames = client.cooldownGames
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd || !interaction.channel) return;
      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
            option.options.forEach((x) => {
              if (x.value) args.push(x.value);
            });
        } else if (option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      if(cmd.cooldown && cmd.cooldown !== 0){
        if (!cooldowns.has(cmd.name)) {
          cooldowns.set(cmd.name, new Discord.Collection()); 
        }
        const now = Date.now();
        const timestamps = cooldowns.get(cmd.name);
        const cooldownAmount = (cmd.cooldown) * 1000;
        if (timestamps.has(interaction.user.id)) {
          const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            if(timeLeft < 1)return;
            return interaction.reply({content:`**${interaction.user.username}**, Cool down (**${Math.floor(timeLeft)} seconds** left)`,ephemeral: true});
          }
        } 
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      }
      if(cmd.cooldownGames){
        if(!cooldownGames.has(cmd.name)) {
          cooldownGames.set(cmd.name, new Discord.Collection()); 
        }
        let channelCooldown = cooldownGames.get(cmd.name);
        if(channelCooldown.has(interaction.channel.id)){
          return interaction.reply({content:`**I عفوا ، هناك جولة بالفعل!**`})
        }
      }
      let guildData = await guildModel.findOne({
        guildID:interaction.guild.id,
      })
      if(!guildData){
        guildData = await new guildModel({
          guildID:interaction.guild.id,
        }).save()
      }
      if(cmd.onlyAdmins){
        let admins = guildData.active.admins
        if(!admins.length) return;
        let validRoles = interaction.member.roles.cache.filter(c => admins.includes(c.id)).map(c => c.id)
        
      if(!validRoles.length && interaction.member.permissions.has("ADMINISTRATOR"))return interaction.reply({
          content:`no admins`,ephemeral:true
        })
      }
      if(cmd.onlyShip && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({
          content:`no ship`,ephemeral:true
        });
      if(cmd.userPermissions){
        if(!interaction.member.permissions.has(cmd.userPermissions)){
          return interaction.reply({content:`no permissions \n needed: \`[${cmd.userPermissions}]\``})
        }
      }
      if(cmd.botPermissions){
        let botPerms = interaction.channel.permissionsFor(client.user);
        if (!botPerms || !botPerms.has(cmd.botPermissions) || !interaction.guild.me.permissions.has(cmd.botPermissions)){
          return interaction.reply({content:`i need permissions \n needed: \`[${cmd.botPermissions}]\``})
        }
      }
      cmd.run(client, interaction, args,guildData); 
    }
  }
}