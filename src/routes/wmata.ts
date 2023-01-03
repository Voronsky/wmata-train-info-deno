import express from 'npm:express@4.18.2';
import {Response} from 'npm:express@4.18.2';
import  { getStationInfo }  from "../controllers/wmata.ts";

const router = express.Router();

router.get('/stationInfo/:station', getStationInfo);
router.get('/', (_req : Request, res : Response): void =>{
    res.status(404).send('route not found');
});
export default router;