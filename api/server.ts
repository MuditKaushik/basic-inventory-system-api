import express from 'express';
import * as bodyParser from 'body-parser';
import { ConfigureServer } from './server-config/config';
import cors from 'cors';

const serverCORS: cors.CorsOptions = {
    preflightContinue: false,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 200,
    maxAge: 3200,
    origin: '*'
}
const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(serverCORS));
new ConfigureServer(app);
app.listen(1800, 'localhost', () => {
    console.log(`app listing at ${1800}`);
});
export default app;
