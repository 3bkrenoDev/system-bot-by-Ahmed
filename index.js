console.clear()
require('events').EventEmitter.defaultMaxListeners = 100000;
const express = require("express");
const app = express();
app.listen(() => console.log(`Programmed By Ahmed Abd El-Latif Gaming`));
app.get("/", (req, res) => res.send(`<h1>Programmed By Ahmed Abd El-Latif Gaming Only</h1>`));
const Discord = require("discord.js")
const client= new Discord.Client({ intents:32767 })
client.config = require("./config.js")
client.slashCommands = new Discord.Collection()
client.cooldownGames = new Discord.Collection();
const { registerFont } = require("canvas");
registerFont("fonts/Cairo-Black.ttf",{ family : "ahmed"})
registerFont("fonts/Cairo-Bold.ttf",{ family : "ahmed"})
registerFont("fonts/Cairo-Regular.ttf",{ family : "ahmed"})
registerFont("fonts/SansSerifBldFLF.otf",{ family : "ahmed"})
registerFont("fonts/Roboto-Light.ttf",{ family : "roboto"})
require("./DataBase/connect.js")
let handlerFiles = ["events","slash"]
handlerFiles.forEach(p => {
    require(`./Handler/${p}`)(client);
});
process.on("unhandledRejection", (err) => {
  if(err.message.includes("The user aborted a request.") || err.message.includes("Unknown interaction")) return;
  console.log(err.stack)
}); 
process.on('warning', (warning) => {
  console.log(warning.stack);
});
client.login(process.env.token)