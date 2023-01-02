import {Request, Response, NextFunction} from 'npm:express@4.18.2';
import Stations from '../../util/stations.json' assert { type: "json" };
import { config , load } from "https://deno.land/std/dotenv/mod.ts";

const configData = await load();
const API_KEY: string = configData['API_KEY']; 
console.log(API_KEY);

export const getStationInfo = async (req :Request, res: Response , _next ) => {
    const station = <string>(req.params.station);
    const stationCode : string = Stations[station.toLocaleLowerCase().replace(' ','-')]; 

    try{
        const response = await fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}`, 
        { 
            headers: {'content-type': 'application/json', 'api_key': `${API_KEY}`}
        });
        const data = await response.json();
        res.status(200).json({message: data});

    } catch (err){
        console.log(err);
        res.status(500).json({message: err});
    }
};
