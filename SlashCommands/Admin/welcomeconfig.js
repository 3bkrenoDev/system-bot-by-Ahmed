const { MessageEmbed, MessageAttachment } = require("discord.js");
let formats = ["png", "jpg"];
var welcomeFunctions = require("../../Functions/welcome");

module.exports = {
  name: `welcome`,
  description: "Config server welcome.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "channel",
      type: 1,
      description: "set the welcome channel.",
      options: [
        {
          name: "channel",
          description: "Channel to set.",
          type: 7,
          channel_types: [0, 5],
        },
      ],
    },
    {
      name: "message",
      type: 1,
      description: "Set the message to send.",
    },
    {
      name: "text",
      type: 1,
      description: "Config the text in welcome image.",
      options: [
        {
          name: "text",
          description: "Set the text in welcome image.",
          type: 3,
        },
        {
          name: "left-x",
          type: 10,
          description: "Coordinate (left)",
        },
        {
          name: "top-y",
          type: 10,
          description: "Coordinate (top)",
        },
      ],
    },
    {
      name: "toggle_message",
      type: 1,
      description: "Enable or disable the welcome message.",
    },
    {
      name: "toggle_image",
      type: 1,
      description: "Enable or disable the welcome image.",
    },
    {
      name: "background",
      type: 1,
      description: "Set backgroud to welcome message",
      options: [
        {
          name: "background",
          type: 11,
          description: "the welcome image's background",
        },
      ],
    },
    {
      name: "remove_background",
      type: 1,
      description: "Delete the welcome image background.",
    },
    {
      name: "avatar",
      type: 1,
      description: "Config the avatar in welcome image.",
      options: [
        {
          name: "left-x",
          type: 10,
          description: "Coordinate (left).",
        },
        {
          name: "top-y",
          type: 10,
          description: "Coordinate (top).",
        },
        {
          name: "width-xw",
          type: 10,
          description: "Avatar width.",
        },
        {
          name: "height-xy",
          type: 10,
          description: "Avatar height.",
        },
      ],
    },
    {
      name: "username",
      type: 1,
      description: "Config the username in welcome image.",
      options: [
        {
          name: "left-x",
          type: 10,
          description: "Coordinate (left).",
        },
        {
          name: "top-y",
          type: 10,
          description: "Coordinate (top).",
        },
      ],
    },
    {
      name: "show",
      type: 1,
      description:
        "Show the informations and test the welcome message and image.",
    },
  ],
  cooldown: 10,
  userPermissions: ["MANAGE_GUILD"],
  run: async (client, interaction, args, guildData) => {
    let subCommand = interaction.options._subcommand;
    let x = interaction.options.getNumber("left-x");
    let y = interaction.options.getNumber("top-y");
    let width = interaction.options.getNumber("width-xw");
    let height = interaction.options.getNumber("height-xy");
    if (subCommand === "avatar") {
      if (!x && !y && !width && !height)
        return interaction.reply({
          content: `**🙄 - You must type anything at least.**`,
        });
      if (x) guildData.welcome.avatar.x = x;
      if (y) guildData.welcome.avatar.y = y;
      if (width) guildData.welcome.avatar.width = width;
      if (height) guildData.welcome.avatar.height = height;
      await guildData.save();
      return interaction.reply(`**✅ - The changes have been saved**`);
    } else if (subCommand === "username") {
      if (!x && !y)
        return interaction.reply({
          content: `**🙄 - You must type anything at least.**`,
        });

      if (x) guildData.welcome.username.x = x;
      if (y) guildData.welcome.username.y = y;
      await guildData.save();
      return interaction.reply(`**✅ - The changes have been saved**`);
    } else if (subCommand === "toggle_message") {
      let toggle = guildData.welcome.toggle.message;
      guildData.welcome.toggle.message = toggle ? false : true;
      guildData.save();
      return interaction.reply({
        content: `**✅ - message toggle has been ${
          toggle ? "Disabled" : "Enabled"
        }.**`,
      });
    } else if (subCommand === "toggle_image") {
      let toggle = guildData.welcome.toggle.image;
      guildData.welcome.toggle.image = toggle ? false : true;
      guildData.save();
      return interaction.reply({
        content: `image toggle has been ${toggle ? "Disabled" : "Enabled"}`,
      });
    } else if (subCommand === "channel") {
      let channel = interaction.options.getChannel("channel");
      guildData.welcome.channel = channel.id;
      guildData.save();
      interaction.reply({
        content: `**✅ - #${channel.name} has been set for welcome channel.**`,
      });
    } else if (subCommand === "message") {
      let embed = new MessageEmbed()
        .setAuthor({
          name: `Now you can insert your message`,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setDescription(
          `**Some useful words 👇 :
> [user] => the member mention.
> [userName] => the member name.
> [memberCount] => Number of server members.
> [server] =>   server name.
> [inviter] => the inviter mention.
> [inviterName] => the inviter name.
> [invites] => the inviter invites number.**`
        )
        .setColor("RED")
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
      let filter = (message) => message.author.id === interaction.user.id;
      let collector = await interaction.channel
        .awaitMessages({
          filter,
          time: 30000,
          max: 1,
          errors: ["time"],
        })
        .then((collected) => {
          let message = collected.first();
          message.delete().catch((err) => 0);
          if (message.content.length > 250)
            return interaction.editReply(
              `**🙄 - The message must be less than 250 characters.**`
            );
          guildData.welcome.message = message.content;
          guildData.save();
          interaction.editReply(`**✅ - The changes have been saved.**`);
        })
        .catch((err) => {
          interaction.editReply(
            `**🙄 - Time's up and you haven't sent your message.**`
          );
        });
    } else if (subCommand === "text") {
      let text = interaction.options.getString("text");
      if (!x && !y && !text)
        return interaction.reply({
          content: `**🙄 - You must type anything at least.**`,
        });

      if (text?.split(" ").length > 5)
        return interaction.reply(`the text must be less than 5 words`);
      if (text) guildData.welcome.text.content = text;
      if (x) guildData.welcome.text.x = x;
      if (y) guildData.welcome.text.y = y;
      guildData.save();
      interaction.reply({ content: `**✅ - The changes have been saved**` });
    } else if (subCommand === "background") {
      let pic = interaction.options.getAttachment("background");
      let nameArray = pic.name.split(".");
      let attEx = nameArray[nameArray.length - 1];
      if (!formats.includes(attEx))
        return interaction.reply(
          `**🙄 - You can only upload files of this type ${formats}**`
        );
      let url = pic.url;
      guildData.welcome.background = url;
      guildData.save();
      interaction.reply({
        content: `**✅ - The welcome background has been set.**`,
        files: [pic],
      });
    } else if (subCommand === "remove_background") {
      if (guildData.welcome.background) {
        guildData.welcome.background = null;
        guildData.save();
      }
      interaction.reply({
        content: `**✅ - The welcome background has been removed.** `,
      });
    } else if (subCommand === "show") {
      let data = guildData.welcome;
      await interaction.reply({
        content: `channel:<#${data.channel}>\ntoggles:\n  message:${
          data.toggle.message ? "Enabled" : "Disabled"
        }\n  image:${
          data.toggle.image ? "Enabled" : "Disabled"
        }\navatar:\n  Coordinate (left):${data.avatar.x}\n  Coordinate (top):${
          data.avatar.y
        }\n  width:${data.avatar.width}\n  height:${
          data.avatar.height
        }\nusername:\n  Coordinate (left):${
          data.username.x
        }\n  Coordinate (top):${data.username.y}\ntext:\n  message:${
          data.text.content
        }\n  Coordinate (left):${data.text.x}\n  Coordinate (top):${
          data.text.y
        }`,
      });
      interaction.followUp({ content: `Welcome message:\n${data.message}` });
      let WelcomeImage = await welcomeFunctions.createWelcomeImage(
        interaction.member,
        data
      );
      if (WelcomeImage)
        interaction.followUp({ content: `The image`, files: [WelcomeImage] });
    }
  },
};
