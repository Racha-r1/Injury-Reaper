const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'help',
    description: 'The help command gives you a list of commands',
    execute(msg, args) {
        const help = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Help")
          .setDescription("Every command starts with a !")
          .addFields(
            {
              name: "team_injuries team",
              value:
                "Gives you the injuries for a team"
            },
            {
                name: "team_names",
                value:
                  "Gives you all the allowed team names that you can pass to the bot"
              },
          )
        msg.channel.send({embeds: [help]});
    }
}