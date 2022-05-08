import {Client, Intents, Message} from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import Command from './types/command';

dotenv.config({path: '../.env'});

const client = new Client({intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]});

const commands: Command[] = [];
const commandFiles: string[] = fs.readdirSync('./commands').filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

client.on('ready', async() => {
	console.log(`Logged in as ${client?.user?.tag}!`);
    for (const file of commandFiles) {
        const command  = await import(`./commands/${file}`) as Command;
        commands.push(command);
    }

});

client.on('messageCreate', (msg: Message) => {
    const commandName: string = msg.content.trim().split(" ")[0].slice(1);
    const args: string[] = msg.content.trim().slice(1).replace(/\s\s+/g, ' ').split(" ").slice(1).filter(arg => arg !== "la" && arg !== "los" && arg !== "angeles");
    const command = commands.find(c => c.name === commandName);
    if(command){
        command.execute(msg, args);
    } 
});

client.login(process.env.TOKEN2);