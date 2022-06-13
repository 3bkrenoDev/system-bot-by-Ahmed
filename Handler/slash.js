const { readdirSync } = require("fs");

const fs = require("fs")
const { glob } = require("glob");
const { promisify } = require("util");

const globPromise = promisify(glob);

module.exports = async(client) => {
  const arrayOfSlashCommands = [];
      const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );
    slashCommands.map((value) => {
      const file = require(value);
      if(!file.name)return;
      client.slashCommands.set(file.name, file);
      if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
arrayOfSlashCommands.push(file);  
    });
    client.on("ready", async () => {
      let globalBot = client.config.globalBot
      if(globalBot){
        await client.application?.commands.set(arrayOfSlashCommands)
      }else{
        let guild = client.guilds.cache.get(client.config.guildID)
        await guild?.commands.set(arrayOfSlashCommands)
      }

    });
        
}
