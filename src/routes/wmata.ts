import express from 'npm:express@4.18.2';
import {Response} from 'npm:express@4.18.2';
import  { getStationInfo }  from "../controllers/wmata.ts";
import {generateToken, auth} from '../../util/auth.ts'

const router = express.Router();

router.post('/login', generateToken);
router.get('/stationInfo/:station', auth, getStationInfo);
router.get('/', (_req : Request, res : Response): void =>{
    res.status(404).send('route not found');
});
export default router;