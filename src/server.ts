import express from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";
import wmataRouter from "./routes/wmata.ts";

const app : express = express();

app.use(express.json());

app.use('/wmata', wmataRouter);

app.listen(8000, ()=>{
    console.log(`Running on server 8000`);
});