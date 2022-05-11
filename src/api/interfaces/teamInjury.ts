import Player from "./player";
export default interface TeamInjury {
    team: string,
    players: Player[],
    logo?: string,
}