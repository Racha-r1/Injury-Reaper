const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Discord.Client();

const teams_to_api_format = {
    "atlanta hawks": "atlanta",
    "boston celtics": "boston",
    "brooklyn nets": "brooklyn",
    "charlotte hornets": "charlotte",
    "chicago bulls": "chicago",
    "cleveland cavaliers": "cleveland",
    "dallas mavericks": "dallas",
    "denver nuggets": "denver",
    "detroit pistons": "detroit",
    "golden state warriors": "golden st",
    "houston rockets": "houston",
    "indiana pacers": "indiana",
    "los angeles clippers": "la clippers",
    "los angeles lakers": "la lakers",
    "memphis grizzlies": "memphis",
    "miami heat": "miami",
    "milwaukee bucks": "milwaukee",
    "minnesota timberwolves": "minnesota",
    "new orleans pelicans": "new orleans",
    "new york knicks": "new york",
    "oklahoma city thunder": "oklahoma city",
    "orlando magic": "orlando",
    "philadelphia 76ers": "philadelphia",
    "phoenix suns": "phoenix",
    "portland trail blazers": "portland",
    "sacramento kings": "sacramento",
    "san antonio spurs": "san antonio",
    "toronto raptors": "toronto",
    "utah jazz": "utah",
    "washington wizards": "washington",
    "atlanta": "atlanta",
    "boston": "boston",
    "brooklyn": "brooklyn",
    "charlotte": "charlotte",
    "chicago": "chicago",
    "cleveland": "cleveland",
    "dallas": "dallas",
    "denver": "denver",
    "detroit": "detroit",
    "golden st": "golden st",
    "houston": "houston",
    "indiana": "indiana",
    "la clippers": "la clippers",
    "la lakers": "la lakers",
    "memphis": "memphis",
    "miami": "miami",
    "milwaukee": "milwaukee",
    "minnesota": "minnesota",
    "new orleans": "new orleans",
    "new york": "new york",
    "oklahoma city": "oklahoma city",
    "orlando": "orlando",
    "philadelphia": "philadelphia",
    "phoenix": "phoenix",
    "portland": "portland",
    "sacramento": "sacramento",
    "san antonio": "san antonio",
    "toronto": "toronto",
    "utah": "utah",
    "washington": "washington"
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith("!team_injuries")){
        const arr = msg.content.split("<");
        const team = arr[1].split(">")[0];
        if (!Object.keys(teams_to_api_format).includes(team.toLowerCase())){
            msg.channel.send("Please use a valid team name");
        }
        else {
            const team_api_name = teams_to_api_format[team.toLowerCase()];
            axios.get(`${process.env.API_URL}${team_api_name}`).then(res => {
                const team_injuries = res.data;
                if (team_injuries.length === 0) {
                    msg.channel.send(`No injuries reported for ${team.charAt(0).toUpperCase() + team.slice(1)}`);
                }
                else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${team_injuries.team} Injuries`)
                        .setColor(0x00AE86)
                        .setFooter('@Copyright Mbongo Bueno Corporations')
                        .setDescription(`${team_injuries.players.map(player => `${player["PLAYER"]} (${player["INJURY STATUS"]})`).join("\n")}`)
                        .setThumbnail(team_injuries.logo)
                    msg.channel.send(embed);
                }
            })
        }
    }

    if (msg.content === "!help(injury_reaper)"){
        const help = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Help")
          .setDescription("Every command starts with a !")
          .addFields(
            {
              name: "team_injuries <team>",
              value:
                "Gives you the injuries for a team"
            },
            {
                name: "team_names",
                value:
                  "Gives you all the allowed team names that you can pass to the bot"
              },
          )
        msg.channel.send(help);
    }

    if (msg.content === "!team_names"){
        const allowed_names = [
            "atlanta hawks | atlanta",
            "boston celtics | boston",
            "brooklyn nets | brooklyn",
            "charlotte hornets | charlotte",
            "chicago bulls | chicago",
            "cleveland cavaliers | cleveland",
            "dallas mavericks | dallas",
            "denver nuggets | denver",
            "detroit pistons | detroit",
            "golden state warriors | golden st",
            "houston rockets | houston",
            "indiana pacers | indiana",
            "los angeles clippers | la clippers",
            "los angeles lakers | la lakers",
            "memphis grizzlies | memphis",
            "miami heat | miami",
            "milwaukee bucks | milwaukee",
            "minnesota timberwolves | minnesota",
            "new orleans pelicans | new orleans",
            "new york knicks | new york",
            "oklahoma city thunder | oklahoma city",
            "orlando magic | orlando",
            "philadelphia 76ers | philadelphia",
            "phoenix suns | phoenix",
            "portland trail blazers | portland",
            "sacramento kings | sacramento",
            "san antonio spurs | san antonio",
            "toronto raptors | toronto",
            "utah jazz | utah",
            "washington wizards | washington"
        ]
        const teams = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Teams")
          .setDescription(`${allowed_names.join("\n")}`)
        msg.channel.send(teams);
    }
});

client.login(process.env.TOKEN);