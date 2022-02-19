const {Client, Intents, Collection} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]});

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
        case "!injuries":
            client.commands.get('injuries').execute(msg, args);
            break;
        case "!teams":
            client.commands.get('teams').execute(msg, args);
            break;
        case "!help":
            client.commands.get('help').execute(msg, args);
            break;
        case "!stats":
            client.commands.get('stats').execute(msg, args);
            break;
        case "!standings":
            client.commands.get('standings').execute(msg, args);
            break;
        default:
            break;
       
    }
});

client.login(process.env.TOKEN2);