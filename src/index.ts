import express, { Express, Request, Response } from "express";
import {routes} from "./routes/index";
import cors from 'cors';
import { Cache } from './types/type';

// Main server code. Starts the server on port 3000
const app: Express = express();
const port = 3000;
const cache: Cache = {};
app.use(cors())
app.use(express.json());

app.use("/", routes(app, cache))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export {app, cache};