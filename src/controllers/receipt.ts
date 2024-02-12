import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Cache, Receipt } from "../types/type";
import { validateReceipt } from "../validators/validator";


// function to calculate the score of the receipt
const calculateReceiptScore = (receipt: Receipt): number => {
    let totalPoints = 0;

    totalPoints += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

    if (parseFloat(receipt.total) === Math.round(parseFloat(receipt.total))) {
      totalPoints += 50;
    }
  
    if (parseFloat(receipt.total) % 0.25 === 0) {
      totalPoints += 25;
    }

    totalPoints += Math.floor(receipt.items.length / 2) * 5;

    receipt.items.forEach((item) => {
      const trimmedLength = item.shortDescription.trim().length;
      if (trimmedLength % 3 === 0) {
        const points = Math.ceil(parseFloat(item.price) * 0.2);
        totalPoints += points;
      }
    });

    const purchaseDateDay = parseInt(receipt.purchaseDate.split('-')[2], 10);
    if (purchaseDateDay % 2 !== 0) {
        totalPoints += 6;
    }

    const [hours, minutes] = receipt.purchaseTime.split(':');
    const purchaseTime = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    if (purchaseTime > 14 * 60 && purchaseTime < 16 * 60) {
        totalPoints += 10;
    }
    return totalPoints;
  };


// The main logic for handling the GET request for the receipt points.
const getReceiptHandler = (myCache: Cache) => (req: Request, res: Response) => {
    try{
        var id = req.params.id;
        if(!myCache[id]){
            res.status(404).send("No receipt found for that id");
            return;
        }
        res.status(200).json({"points":myCache[id]});
    }
    catch(error){
        console.log("error in get receipt handler: ", error);
        res.status(500).send("Internal Server Error!");
    }
}

// The main logic for handling the receipt processing POST request.
const createReceiptHandler = (myCache: Cache) => async (req: Request, res: Response) => {
    try {
        // validate input type
        const receiptData: Receipt = req.body;
        if (receiptData === undefined || receiptData === null || Object.keys(receiptData).length === 0){        
        
            return res.status(400).json({ error: 'The receipt is invalid' });
           
        }
        const isValid = await validateReceipt(receiptData);
        if (!isValid) {
            return res.status(400).json({ error: 'The receipt is invalid' });
        }
        
        // fetch scores
        const score = calculateReceiptScore(receiptData);
        const receiptId = uuidv4();
        // cache the values
        myCache[receiptId] = score;
    
        res.status(200).json({ id: receiptId });
        } catch (error) {
            if (error instanceof TypeError) {
                return res.status(400).json({ error: 'The receipt is invalid' });
            }

            res.status(500).json({ error: 'Internal Server Error' });
        }
  };

export {getReceiptHandler, createReceiptHandler, calculateReceiptScore};