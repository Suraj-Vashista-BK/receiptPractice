import { Receipt, Item } from '../types/type';

const validateReceipt = async (receiptData: Receipt): Promise<boolean> => {
    const retailerPattern = /^[\w\s\-&]+$/;
    const purchaseDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const purchaseTimePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    const totalPattern = /^\d+\.\d{2}$/;
    const itemDescPattern = /^[\w\s\-&]+$/;
    const pricePattern = /^\d+\.\d{2}$/;

    const isValidRetailer = retailerPattern.test(receiptData.retailer);
    const isValidPurchaseDate = purchaseDatePattern.test(receiptData.purchaseDate);
    const isValidPurchaseTime = purchaseTimePattern.test(receiptData.purchaseTime);
    const isValidTotal = totalPattern.test(receiptData.total);
    const hasAtLeastOneItem = receiptData.items.length > 0;

    const isValidItems = receiptData.items.every((item: Item) =>
        itemDescPattern.test(item.shortDescription) && pricePattern.test(item.price)
    );

    return isValidRetailer && isValidPurchaseDate && isValidPurchaseTime && isValidTotal && isValidItems && hasAtLeastOneItem;
};

export { validateReceipt };
