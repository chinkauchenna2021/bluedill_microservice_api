import express  from 'express';
import { PORT } from './config';
import router from './router';
import bodyParser from 'body-parser';
import Cors from 'cors'
import path from 'path';


const app = express();


const port = process.env.PORT || 8000 
app.use(Cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('images',express.static(path.join(__dirname , "images")));
app.use('/',router);
// app.use(bodyParser.json);
// app.use(bodyParser.urlencoded({extended:false}));

app.listen(port , ()=>{
    console.log(`app running on port ${port}`)
})