import {MessageEmbed, Message}  from 'discord.js';
import axios  from 'axios';
import Command from '../types/command';
import PlayerStat from '../types/playerStat';

const stats_endpoints: Record<string,string> = {
    "points": "stats/points",
    "rebounds": "stats/rebounds",
    "assists": "stats/assists",
    "ftm" : "stats/ftm",
    "fta" : "stats/fta",
    "3p%" : "stats/3pfg",
    "fg%" : "stats/2pfg",
    "3pa" : "stats/3pa",
    "fgm" : "stats/fgm", 
    "fga" : "stats/fga",
    "steals" : "stats/steals",
    "blocks" : "stats/blocks",
}

const stats : Command  = {
    name: 'stats',
    description: 'Get the top 50 players for a specific stat',
    async execute(msg, args) {
        if(!Object.keys(stats_endpoints).includes(args[0].toLowerCase())) {
            msg.channel.send("Invalid stat");
            return;
        }
        const embeds = await buildEmbeds(stats_endpoints[args[0]], args[0]);
        await paginationEmbed(msg, embeds);
    }
}

const buildEmbeds = async(endpoint: string, stat: string) : Promise<MessageEmbed[]> => {
    const port = process.env.PORT || 5000;
    const url = `http://localhost:${port}/`;
    const {data}  = await axios.get(`${url}${endpoint}`);
    const embeds = [];
    for(let i = 0; i < data.length; i+=10){
        const embed = new MessageEmbed()
            .setTitle(`Top 50 ${stat.charAt(0).toUpperCase() + stat.slice(1)} Leaders`)
            .setColor(0x00AE86)
            .setDescription(`${data.slice(i, i+10).map((player: PlayerStat) => `${player["rank" as keyof PlayerStat]}. ${player["name"  as keyof PlayerStat]} \`(${player["avg" as keyof PlayerStat]})\``).join("\n")}`);
        embeds.push(embed);
    }
    return embeds;
}

const paginationEmbed = async (msg: Message, pages: MessageEmbed[]) => {
    const emojiList = ['⏪', '⏩'];
    const filter = (reaction: any, user: any) => {
        return emojiList.includes(reaction.emoji.name);
    } 
	if (!msg) throw new Error('The channel is inaccessible.');
	if (!pages) throw new Error('There are no embeds to display.');
	if (emojiList.length !== 2) throw new Error('pass at least two emojis.');
	let page = 0;
	const message = await msg.channel.send({embeds: [pages[page].setFooter({text: `Page ${page + 1} / ${pages.length}\n @Copyright Mbongo Bueno Corporations`})]});
	for (const emoji of emojiList){
        await message.react(emoji);
    }

	const collector = message.createReactionCollector({filter, time: 12000});
	collector.on('collect', reaction => {
		reaction.users.remove(msg.author);
		switch (reaction.emoji.name) {
			case emojiList[0]:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case emojiList[1]:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		message.edit({embeds: [pages[page].setFooter({text: `Page ${page + 1} / ${pages.length}\n @Copyright Mbongo Bueno Corporations`})]});
	});
	collector.on('end', () => {
		if (!message.deleted) {
			message.reactions.removeAll()
		}
	});
	return message;
};

export = stats;