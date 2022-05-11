import { Router, Request, Response} from "express";
import cheerio from 'cheerio';
import axios from 'axios';
import logos from '../logos';
import Player from "../interfaces/player";
import TeamInjury from "../interfaces/teamInjury";

const router = Router();

const CBS_SPORTS_URL = 'https://www.cbssports.com/nba/injuries/';

const get_all_injuries = async () => {
    const {data} = await axios.get(CBS_SPORTS_URL);
    const $ = cheerio.load(data);
    const POS1 = "PLAYER";
    const POS2 = "POSITION";
    const POS3 = "UPDATED";
    const POS4 = "INJURY";
    const POS5 = "INJURY STATUS";
    const team_injuries: TeamInjury[]= [];
    $("div.TableBaseWrapper").each((i, el) => {
        const player_rows = $(el).find("tr.TableBase-bodyTr");
        const players: Player[] = [];
        player_rows.each((i, el) => {
            const player_data = $(el).find("td");
            const player: Player = {};
            const player_names = player_data.eq(0);
            const player_name = $(player_names).find("span.CellPlayerName--long").text().replace(/\s\s+/g, '');
            player[POS1] = player_name;
            player[POS2] = player_data.eq(1).text().replace(/\s\s+/g, '');
            player[POS3] = player_data.eq(2).text().replace(/\s\s+/g, '');
            player[POS4] = player_data.eq(3).text().replace(/\s\s+/g, '');
            player[POS5] = player_data.eq(4).text().replace(/\s\s+/g, '');
            players.push(player);
        });
        const team = $(el).find("div.TeamLogoNameLockup-name").text();
        team_injuries.push({team, players});
    });
    team_injuries.forEach(team_injury => {
        const index = Object.keys(logos).find(key => key.toLowerCase().includes(team_injury.team.toLowerCase().replace(/\./g, '')));
        if (index){
            const logo = logos[index];
            team_injury.logo = logo;
        }
    });
    return team_injuries;
}

router.get('/', async(req: Request, res: Response) => {
    const team_injuries = await get_all_injuries();
    console.log(team_injuries);
    res.send(team_injuries);
});

router.get('/:team',async(req: Request, res: Response) => {
    const team_injuries = await get_all_injuries();
    const team = team_injuries.find(team => team.team.toLowerCase().replace(/\./g, '') === req.params.team.toLowerCase().replace(/\./g, ''));
    res.send(team); 
});


export default router;