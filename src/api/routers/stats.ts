import {Router, Request, Response} from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import Stat from '../interfaces/stat';
import PlayerStat from '../interfaces/playerStat';

const router = Router();

const STATS_URL: Record<string, Stat> = {
    "REBOUNDS": {
        url :"https://www.espn.com/nba/stats/player/_/table/general/sort/avgRebounds/dir/desc",
        pos: 14
    },  
    "ASSISTS": {
        url : "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgAssists/dir/desc",
        pos: 15
    },
    "POINTS": {
        url : "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgPoints/dir/desc",
        pos : 4
    },
    "3PM": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgThreePointFieldGoalsMade/dir/desc",
        pos: 8
    },
    "3PFG": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/threePointFieldGoalPct/dir/desc",
        pos: 10
    },
    "FTM": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgFreeThrowsMade/dir/desc",
        pos: 11
    },
    "FGM": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgFieldGoalsMade/dir/desc",
        pos: 5
    },
    "FGA": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgFieldGoalsAttempted/dir/desc",
        pos: 6
    },
    "2PFG": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/fieldGoalPct/dir/desc",
        pos: 7
    },
    "3PA": {
        url: "https://www.espn.com/nba/stats/player/_/table/offensive/sort/avgThreePointFieldGoalsAttempted/dir/desc",
        pos: 9
    }
}

router.get('/:type', async(req: Request, res: Response) => {
    const type = req.params.type.toUpperCase();
    if (!Object.keys(STATS_URL).includes(type)) res.send("404 Not found").status(404);
    const {url, pos} = STATS_URL[type as keyof typeof STATS_URL];
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    const results: PlayerStat[] = [];
    $("div.ResponsiveTable.ResponsiveTable--fixed-left.mt4.Table2__title--remove-capitalization tr").each((i, el) => {
        const row = $(el).find("td");
        const name = row.eq(1).find("a").text().replace(/\s\s+/g, '');
        const rank = row.eq(0).text().replace(/\s\s+/g, '');
        if (name.length > 0 && rank.length > 0) {
            results.push({rank, name});
        }
    });
    let index = 0;
    $("div.Table__Scroller > table > tbody > tr").each((i, el) => {
        const row = $(el).find("td");
        const avg = row.eq(pos-1).text().replace(/\s\s+/g, '');
        const position = row.eq(0).text().replace(/\s\s+/g, '');
        results[index]["avg"] = avg;
        results[index]["position"] = position;
        index += 1;
    });
    res.send(results);
});


export default router;