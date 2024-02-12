import { Request, Response, NextFunction } from "express";

// Second Layer of Middleware checks for facts on valid input data
const factCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { purchaseDate, purchaseTime, total, items } = req.body;

    // Check if the purchase date is a valid date. Dates like 0000-00-00 , 2020-13-01, 2020-12-32 are not valid while their fromat is correct
    const date = new Date(purchaseDate);
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
    for (const item of items) {
        const priceValue = parseFloat(item.price);
        if (isNaN(priceValue) || priceValue > 10e10) {
            return res.status(400).json({ error: `Price for item "${item.shortDescription}" is invalid or too high` });
        }
        if(priceValue == 0){
            return res.status(400).json({ error: `Price for item "${item.shortDescription}" cannot be zero` });
        }
    }
    next();
};

export { factCheckMiddleware };