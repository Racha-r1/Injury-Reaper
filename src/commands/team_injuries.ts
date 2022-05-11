import axios from 'axios';
import {MessageEmbed} from 'discord.js';
import teams from "../objects/teams";
import Player from '../types/player';
import Command from '../types/command';

const team_injuries: Command = {
    name: 'injuries',
    description: 'Get the latest injuries reported for the specified team',
    execute(msg, args) {
        if (args.length === 0) return;
        let team = isTeam(teams, args[0].toLowerCase());
        if (team === false){
            msg.channel.send("That team is not recognized. Please use the !teams command to see a list of valid teams.");
            return;
        }
        team = team as string;
        const team_api_name = teams[team];
        let output_name = "";
        for (let i = 0; i < team.trim().split(" ").length; i++){
            output_name += team.split(" ")[i].charAt(0).toUpperCase() + team.split(" ")[i].slice(1);
            output_name += " ";
        }
        const port = process.env.PORT || 5000;
        const url = `http://localhost:${port}/`;
        axios.get(`${url}${team_api_name}`).then(res => {
            const team_injuries = res.data;
            if (team_injuries.length === 0) {
                msg.channel.send(`No injuries reported for ${output_name.trim()}`);
            }
            else {
                const embed = new MessageEmbed()
                    .setTitle(`${output_name.trim()} Injuries`)
                    .setColor(0x00AE86)
                    .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
                    .setDescription(`${team_injuries.players.map((player: Player) => `${player["PLAYER"]} (${player["INJURY STATUS"]})`).join("\n")}`)
                    .setThumbnail(team_injuries.logo);
                 msg.channel.send({embeds: [embed]});
            }
        }) 
    }
}

function isTeam(teams: Record<string, string>, word: string): boolean | string {
    let teamVal: boolean | string  = false;
    Object.keys(teams).forEach(team => {
        if (team.split(" ").includes(word.toLowerCase())){
            teamVal = team;
        }
    });
    return teamVal;
}

export = team_injuries;