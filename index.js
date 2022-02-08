const {Client, Intents, Collection} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.commands = new Collection();
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commands) {

   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    const command = msg.content.trim().split(" ")[0];
    const args = msg.content.trim().slice(1).replace(/\s\s+/g, ' ').split(" ").slice(1).filter(arg => arg !== "la" && arg !== "los" && arg !== "angeles");
    switch(command) {
        case "!team_injuries":
            client.commands.get('team_injuries').execute(msg, args);
            break;
        case "!team_names":
            client.commands.get('team_names').execute(msg, args);
            break;
        case "!help":
            client.commands.get('help').execute(msg, args);
            break;
        default:
            break;
    }
});

client.login(process.env.TOKEN);