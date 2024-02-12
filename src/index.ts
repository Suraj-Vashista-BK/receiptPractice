import express, { Express, Request, Response, NextFunction } from "express";
import { ValidationError } from 'express-validation';
import {routes} from "./routes/index";
import morgan from "morgan";
import cors from 'cors';
import { Cache } from './types/type';

// Main server code. Starts the server on port 3000
const app: Express = express();
const port = 3000;
const cache: Cache = {};
app.use(cors())
app.use(express.json());
app.use(morgan("combined"));

app.use("/",routes(app, cache))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error handling middleware
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(400).json(err.message);
  }
  return res.status(500).json(err);
});

export {app, cache};