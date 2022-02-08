const axios = require('axios');
const {MessageEmbed} = require('discord.js');
const teams = require("../teams.json");
require('dotenv').config();

module.exports = {
    name: 'team_injuries',
    description: 'Get the latest injuries reported for the specified team',
    execute(msg, args) {
        if (args.length === 0) return;
        let team = isTeam(teams, args[0].toLowerCase());
        if (team === false){
            msg.channel.send("That team is not recognized. Please use the !team_names command to see a list of valid teams.");
            return;
        }
        const team_api_name = teams[team];
        let output_name = "";
        for (let i = 0; i < team.trim().split(" ").length; i++){
            output_name += team.split(" ")[i].charAt(0).toUpperCase() + team.split(" ")[i].slice(1);
            output_name += " ";
        }
        axios.get(`${process.env.API_URL}${team_api_name}`).then(res => {
            const team_injuries = res.data;
            if (team_injuries.length === 0) {
                msg.channel.send(`No injuries reported for ${output_name.trim()}`);
            }
            else {
                const embed = new MessageEmbed()
                    .setTitle(`${output_name.trim()} Injuries`)
                    .setColor(0x00AE86)
                    .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
                    .setDescription(`${team_injuries.players.map(player => `${player["PLAYER"]} (${player["INJURY STATUS"]})`).join("\n")}`)
                    .setThumbnail(team_injuries.logo);
                 msg.channel.send({embeds: [embed]});
            }
        }) 
    }
}

function isTeam(teams, word) {
    let teamVal = false;
    Object.keys(teams).forEach(team => {
        if (team.split(" ").includes(word.toLowerCase())){
            teamVal = team;
        }
    });
    return teamVal;
}