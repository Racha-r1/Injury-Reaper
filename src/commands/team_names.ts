import {MessageEmbed} from 'discord.js';
import teams_json from "../objects/team_initials";
import Command from '../types/command';

const team_names : Command = {
    name: 'teams',
    description: 'Gives you all the allowed team names that you can pass to the bot',
    execute(msg, args) {
        const teams = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Teams")
          .setDescription(`${Object.keys(teams_json).map((team: string) => `${team} \`(${teams_json[team]})\``).join("\n")}`)
          .setFooter({text: '@Copyright Mbongo Bueno Corporations'})
        msg.channel.send({embeds: [teams]});
    }
}

export = team_names;
