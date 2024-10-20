import * as I from '../../api/types';
import { getCountry } from '../countries';
import { Player } from 'csgogsi';
import "./playeroverview.scss";
// import { apiUrl } from '../../API';

interface IProps {
    player: I.Player,
    show: boolean,
    veto: I.Veto | null
    players: Player[],
    round: number
}

const sum = (data: number[]) => data.reduce((a, b) => a + b, 0);

const calcWidth = (val: number | string, max?: number) => {
    const value = Number(val);
    if(value === 0) return 0;
    let maximum = max;
    if(!maximum) {
        maximum = Math.ceil(value/100)*100;
    }
    if(value > maximum){
        return 100;
    }
    return 100*value/maximum;
}

const PlayerOverview = ({ player, show, veto, players, round }: IProps) => {
    if(!player || !veto || !veto.rounds) return null;
    const getData = () => {
        if(!veto.rounds) return null;
        const stats = veto.rounds.map(round => round ? round.players[player.steamid] : {
			kills: 0,
			killshs: 0,
			damage: 0
		}).filter(data => !!data);
        const overall = {
            damage: sum(stats.map(round => round.damage)),
            kills: sum(stats.map(round => round.kills)),
            killshs: sum(stats.map(round => round.killshs)),
        };
        const data = {
            adr: stats.length !== 0 ? (overall.damage/(round-1)).toFixed(0) : '0',
            kills: overall.kills,
            killshs: overall.kills,
            kpr: stats.length !== 0 ? (overall.kills/stats.length).toFixed(2) : 0,
            hsp: overall.kills !== 0 ? (100*overall.killshs/overall.kills).toFixed(0) : '0'
        }
        return data;
    }

    const data = getData();
    if(!data) return null;
    const url = player.avatar;

    const countryName = player.country ? getCountry(player.country) : null;
    let side = '';
    const inGamePlayer = players.find(inGamePlayer => inGamePlayer.steamid === player.steamid);
    if(inGamePlayer) side = inGamePlayer.team.side;
    return (
        <div className={`player-overview ${show ? 'show':''} ${side}`}>
            <div className="player-overview-picture">
                {url ? <img src={url} alt={`${player.username}'s avatar`}/> : null}
            </div>
            {/* <div className="player-overview-username">{url && countryName ? <img src={`${apiUrl}files/img/flags/${countryName.replace(/ /g, "-")}.png`} className="flag" alt={countryName}/> : null }{player.username.toUpperCase()}</div> */}

            <div className="player-overview-stats">
                <div className="player-overview-stat">
                    <div className="label">KILLS: {data.kills}</div>
                    <div className="panel">
                        <div className="filling" style={{width:`${calcWidth(data.kills, data.kills <= 30 ? 30 : 40)}%`}}></div>
                    </div>
                </div>
                <div className="player-overview-stat">
                    <div className="label">HS: {data.hsp}%</div>
                    <div className="panel">
                        <div className="filling" style={{width:`${calcWidth(data.hsp, 100)}%`}}></div>
                    </div>
                </div>
                <div className="player-overview-stat">
                    <div className="label">ADR: {data.adr}</div>
                    <div className="panel">
                        <div className="filling" style={{width:`${calcWidth(data.adr)}%`}}></div>
                    </div>
                </div>
                <div className="player-overview-stat">
                    <div className="label">KPR: {data.kpr}</div>
                    <div className="panel">
                        <div className="filling" style={{width:`${calcWidth(Number(data.kpr)*100)}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
   
}

export default PlayerOverview;