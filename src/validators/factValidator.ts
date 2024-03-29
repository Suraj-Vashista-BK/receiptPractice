import { Request, Response, NextFunction } from "express";

// Second Layer of Middleware checks for facts on valid input data
const factCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { purchaseDate, purchaseTime, total, items } = req.body;

    // Check if the purchase date is a valid date. Dates like 0000-00-00,2020-13-01,2020-12-32 are not valid while their fromat is correct
    const date = new Date(purchaseDate);
    const today = new Date();
    if (date > today) {
        return res.status(400).json({ error: 'Purchase date cannot be in the future' });
    }
    const dateNum = date.getTime();
    if (!dateNum && dateNum !== 0 || date.toISOString().slice(0, 10) !== purchaseDate) {
        return res.status(400).json({ error: 'Purchase date is not a valid date' });
    }

    // check valid total
    const totalValue = parseFloat(total);
    if (isNaN(totalValue) || totalValue > 10e10) {
        return res.status(400).json({ error: 'Total is invalid or too high' });
    }
    if (totalValue == 0){
        return res.status(400).json({ error: 'Total cannot be zero' });
    }

    // check validity of each time price
    var priceSum = 0;
    for (const item of items) {
        const priceValue = parseFloat(item.price);
        priceSum += priceValue;
        if (isNaN(priceValue) || priceValue > 10e10) {
            return res.status(400).json({ error: `Price for item "${item.shortDescription}" is invalid or too high` });
        }
        if(priceValue == 0){
            return res.status(400).json({ error: `Price for item "${item.shortDescription}" cannot be zero` });
        }
    }

    // check if the total is the sum of the prices of the items with error for upto 0.01
    if (Math.abs(totalValue - priceSum) > 0.01) {
        return res.status(400).json({ error: 'Total is not the sum of the prices of the items' });
    }

    // limit max items to 150
    const maxItemsAllowed = 150;
    if (items.length > maxItemsAllowed) {
        return res.status(400).json({ error: `The number of items cannot exceed ${maxItemsAllowed}` });
    }

    next();
};

export { factCheckMiddleware };