import express from 'express';
import * as bodyParser from 'body-parser';
import { ConfigureServer } from './server-config/config';
import cors from 'cors';
const app: express.Application = express();
let serverConfig = new ConfigureServer(app);
app.use(bodyParser.json({ strict: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(serverConfig.cors));
app.listen(1800, 'localhost', () => {
    console.log(`app listing at ${1800}`);
});
export default app;
