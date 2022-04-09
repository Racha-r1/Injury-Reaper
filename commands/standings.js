const {MessageEmbed} = require('discord.js');
const axios = require('axios');
const team_json = require("../teams_fullname.json");
require('dotenv').config();

const getTeam = (team_name) => {
  if (team_name.indexOf('-') === -1) return team_name;
  return team_name.slice(0,team_name.indexOf('-')).trim();
}

module.exports = {
    name: 'standings',
    description: 'Get the standings of a specific conference',
    async execute(msg, args) {
        const {data} = await axios.get(`${process.env.API_URL}standings/${args[0]}`);
        const teams = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(data.conference)
          .setDescription(`${data.standings.map(standing => `${standing.rank}. ${team_json[getTeam(standing.team).toLowerCase()]} \`${standing.wins} - ${standing.losses}\``).join("\n")}`)
          .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
        msg.channel.send({embeds: [teams]});
    }
}
