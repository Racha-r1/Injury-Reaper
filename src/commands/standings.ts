import {MessageEmbed} from 'discord.js';
import axios from 'axios';
import team_json from '../objects/fullname';
import Standing from '../types/standing';
import Command from '../types/command';

const getTeam = (team_name: string): string => {
  if (team_name.indexOf('-') === -1) return team_name;
  return team_name.slice(0,team_name.indexOf('-')).trim();
}

const standings: Command = {
    name: 'standings',
    description: 'Get the standings of a specific conference',
    async execute(msg, args) {
        const {data} = await axios.get(`${process.env.API_URL}standings/${args[0]}`);
        const teams = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(data.conference)
          .setDescription(`${data.standings.map((standing: Standing) => `${standing.rank}. ${team_json[getTeam(standing.team).toLowerCase()]} \`${standing.wins} - ${standing.losses}\``).join("\n")}`)
          .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
        msg.channel.send({embeds: [teams]});
    }
}

export = standings;