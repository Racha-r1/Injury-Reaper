const {MessageEmbed} = require('discord.js');
const axios = require('axios');

const stats_endpoints = {
    "points": "stats/points",
    "rebounds": "stats/rebounds",
    "assists": "stats/assists",
    "ftm" : "stats/ftm",
    "fta" : "stats/fta",
    "3p%" : "stats/3pfg",
    "fg%" : "stats/2pfg",
    "3pa" : "stats/3pa",
    "fgm" : "stats/fgm", 
    "fga" : "stats/fga"
}

module.exports = {
    name: 'stats',
    description: 'Get the top 50 players for a specific stat',
    async execute(msg, args) {
        if(!Object.keys(stats_endpoints).includes(args[0])) {
            msg.channel.send("Invalid stat");
            return;
        }
        const embeds = await buildEmbeds(stats_endpoints[args[0]], args[0]);
        paginationEmbed(msg, embeds);
    }
}

const buildEmbeds = async(endpoint, stat) => {
    const {data}  = await axios.get(`${process.env.API_URL}${endpoint}`);
    const embeds = [];
    for(let i = 0; i < data.length; i+=10){
        const embed = new MessageEmbed()
            .setTitle(`Top 50 ${stat.charAt(0).toUpperCase() + stat.slice(1)} Leaders`)
            .setColor(0x00AE86)
            .setDescription(`${data.slice(i, i+10).map(player => `${player["rank"]}. ${player["name"]} \`(${player["avg"]})\``).join("\n")}`)
            .setThumbnail(data[i]["TEAM LOGO"]);
        embeds.push(embed);
    }
    return embeds;
}

const paginationEmbed = async (msg, pages) => {
    const emojiList = ['⏪', '⏩'];
    const filter = (reaction, user) => {
        console.log(reaction.emoji.name);
        return emojiList.includes(reaction.emoji.name);
    } 
	if (!msg && !msg.channel) throw new Error('The channel is inaccessible.');
	if (!pages) throw new Error('There are no embeds to display.');
	if (emojiList.length !== 2) throw new Error('pass at least two emojis.');
	let page = 0;
	const message = await msg.channel.send({embeds: [pages[page].setFooter({text: `Page ${page + 1} / ${pages.length}\n @Copyright Mbongo Bueno Corporations`})]});
	for (const emoji of emojiList){
        await message.react(emoji);
    }
	const collector = message.createReactionCollector(filter, {time: 120000});
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