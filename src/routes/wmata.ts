import express from 'npm:express@4.18.2';
import  { getStationInfo }  from "../controllers/wmata.ts";

const router = express.Router();

router.get('/getStationInfo/:station', getStationInfo);
router.get('/', (req , res )=>{
    res.status(404).send('route not found');
});
export default router;