import express, { Express, Request, Response , NextFunction } from 'express';
import { PORT } from './config';
import router from './router';
import bodyParser from 'body-parser';

const app = express();

const port = PORT | 8000 
app.use('/', router);
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended:false}));

app.listen(PORT , ()=>{
    console.log(`app running on port ${PORT}`)
})