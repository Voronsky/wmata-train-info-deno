import {Request, Response} from 'npm:express@4.18.2';
import Stations from '../../util/stations.json' assert { type: "json" };
import { load } from "https://deno.land/std/dotenv/mod.ts";
import {Train} from '../models/wmata.ts';
import * as log from "https://deno.land/std/log/mod.ts";

const configData = await load();
const API_KEY: string = configData['API_KEY']; 
log.debug(API_KEY);



/**
 * Obtains real-time predictions of trains arriving at a given station. NOTE: stations are converted to lower-case and white spaces replaced with a dash 
 * @param req - request 
 * @param res - response
 * @param _next - ignored 
 * @param station - Station to pull from WMATA's api , found in the req.params
 */
export const getStationInfo = async (req :Request, res: Response , _next: any,) => {
    const station = (<string>req.params.station).toLocaleLowerCase().replace(' ','-');
    const stationCode  = Stations[(station as keyof typeof Stations)];
    const trains: Train[] = [];
    try{
        const response = await fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}`, 
        { 
            headers: {'content-type': 'application/json', 'api_key': `${API_KEY}`}
        });
        const data = await response.json();
        let trainData = data['Trains'];
        log.debug(trainData);
        for(let train of trainData){
        log.debug(train);
            const newTrain : Train = { car: parseInt(train['Car']), destination: train['Destination'], line: train['Line'], arrivalTime: train['Min']};

            trains.push(newTrain);
            
        }
        res.status(200).json({message: trains});

    } catch (err){
        log.error(err);
        res.status(500).json({message: err});
    }
};
