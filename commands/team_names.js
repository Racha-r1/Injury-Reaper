const {MessageEmbed} = require('discord.js');
const teams_json = require("../teams.json");

module.exports = {
    name: 'team_names',
    description: 'Gives you all the allowed team names that you can pass to the bot',
    execute(msg, args) {
        const teams = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Teams")
          .setDescription(`${Object.keys(teams_json).join("\n")}`)
        msg.channel.send({embeds: [teams]});
    }
}