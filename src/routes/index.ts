import { Application, Router, Request, Response } from "express";
import { getReceiptHandler, createReceiptHandler } from "../controllers/receipt";
import { Cache } from "../types/type";
import { validateReceiptMiddleware } from "../validators/formatValidator";
import { factCheckMiddleware } from "../validators/factValidator";

// Routes for the application.
export const routes = (app: Application, myCache: Cache | any) => {
    const router = Router();
    router.get("/", (req: Request, res:Response) => {
        res.send("Fetch Coding Exercise!");
    });

    // post receipt
    router.post("/receipts/process",validateReceiptMiddleware,factCheckMiddleware,createReceiptHandler(myCache));
    // get receipt
    router.get("/receipts/:id/points",getReceiptHandler(myCache));


    return router;
}