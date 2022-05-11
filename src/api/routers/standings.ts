import { Router, Request, Response} from "express";
import cheerio from 'cheerio';
import axios from 'axios';
import Standing  from "../interfaces/standing";
import Conference from "../interfaces/conference";

const router = Router();

const URL = 'https://www.cbssports.com/nba/standings/regular/conference/';

const get_standings = async () => {
    const {data} = await axios.get(URL);
    const $ = cheerio.load(data);
    const conference_standings: Conference[] = [];
    $("div.TableBaseWrapper").each((i, el) => {
        const conference = `${$(el).find("h4").text().replace(/\s\s+/g, '')} Conference`;
        const standings: Standing[] = [];
        $(el).find("tr").each((i, el) => {
            const row = $(el).find("td");
            const rank = row.eq(0).text().replace(/\s\s+/g, '');
            const team = row.eq(1).text().replace(/\s\s+/g, '');
            const wins = row.eq(2).text().replace(/\s\s+/g, '');
            const losses = row.eq(3).text().replace(/\s\s+/g, '');
            const standing: Standing = {rank,team,wins,losses};
            if (standing.rank.length !== 0) standings.push(standing);
        });
        const conference_standing = { conference, standings};
        conference_standings.push(conference_standing);
    });
    return conference_standings;
}

router.get('/:conf', async(req: Request, res: Response) => {
    const standings = await get_standings();
    const conf = standings.find(conf => conf.conference.toLowerCase().startsWith(req.params.conf.toLowerCase()));
    res.send(conf);
});

export default router;