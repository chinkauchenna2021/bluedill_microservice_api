import express  from 'express';
import { PORT } from './config';
import router from './router';
import bodyParser from 'body-parser';
import Cors from 'cors'

const app = express();

const port = PORT | 8000 
app.use(Cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/',router);
// app.use(bodyParser.json);
// app.use(bodyParser.urlencoded({extended:false}));

app.listen(PORT , ()=>{
    console.log(`app running on port ${PORT}`)
})