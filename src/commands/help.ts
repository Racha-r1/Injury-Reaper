import { MessageEmbed} from 'discord.js';
import Command from '../types/command';

const help : Command = {
    name: 'help',
    description: 'The help command gives you a list of commands',
    execute(msg, args) {
        const help = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Help")
          .setDescription("Every command starts with a !")
          .addFields(
            {
              name: "!injuries `team`",
              value:
                "Gives you the injuries for a team \n `ex: !injuries Clippers`"        
            },
            {
                name: "!teams",
                value:
                  "Gives you all the allowed team names that you can pass to the bot"
            },
            {
              name: "!stats `statType`",
              value:
                "Gives you the top 50 players that have the highest average in the particular stat \n `ex: !stats rebounds`"
            },
            {
              name: "!standings `conference`",
              value:
                "Gives you the standings of a particular conference \n `ex: !standings east`"
            },
          )
        msg.channel.send({embeds: [help]});
    }
}

export = help;
