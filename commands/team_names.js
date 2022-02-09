const {MessageEmbed} = require('discord.js');
const teams_json = require("../team_initials.json");

module.exports = {
    name: 'teams',
    description: 'Gives you all the allowed team names that you can pass to the bot',
    execute(msg, args) {
        const teams = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Teams")
          .setDescription(`${Object.keys(teams_json).map(team => `${team} \`(${teams_json[team]})\``).join("\n")}`)
          .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
        msg.channel.send({embeds: [teams]});
    }
}