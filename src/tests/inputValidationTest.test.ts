import { Receipt, Item } from '../types/type';
import { validateReceipt } from '../validators/validator';

// This test suite mainly focuses on the input validation of the provided receipt data.
describe('Input Validation Test', () => {
    // input satisfies all the rules
    test('Validates a correct receipt successfully', async () => {
        const receipt: Receipt = {
          retailer: "M&M Corner Market",
          purchaseDate: "2022-05-15",
          purchaseTime: "14:30",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "5.99"
            },
            {
              shortDescription: "Lays Chips",
              price: "2.50"
            }
          ],
          total: "8.49"
        };
    
        const isValid = await validateReceipt(receipt);
        expect(isValid).toBe(true);
      });

    // according to the rules, the retailer name should only contain letters, numbers, spaces, hyphens, and ampersands
    test('Rejects receipt with invalid retailer name', async () => {
        const receipt: Receipt = {
          retailer: "M**(*!M Corner Market",
          purchaseDate: "2022-05-15",
          purchaseTime: "14:30",
          items: [
            {
              shortDescription: "Mountain Dew 12PK",
              price: "5.99"
            },
            {
              shortDescription: "Lays Chips",
              price: "2.50"
            }
          ],
          total: "8.49"
        };
    
        const isValid = await validateReceipt(receipt);
        expect(isValid).toBe(false);
      });

    // according to the rules, the date should be in the format of "yyyy-mm-dd"
    test('Rejects receipt with invalid date format', async () => {
        const receipt: Receipt = {
            retailer: "Target",
            purchaseDate: "05-15-2022", // Incorrect date format
            purchaseTime: "10:00",
            items: [
            {
                shortDescription: "Apples",
                price: "3.50"
            }
            ],
            total: "3.50"
        };

        const isValid = await validateReceipt(receipt);
        expect(isValid).toBe(false);
    });

    // according to the rules, the time should be in the format of "hh:mm"
    test('Rejects receipt with invalid time format', async () => {
        const receipt: Receipt = {
            retailer: "Target",
            purchaseDate: "2022-05-15",
            purchaseTime: "10:00 AM", // Incorrect time format
            items: [
            {
                shortDescription: "Apples",
                price: "3.50"
            }
            ],
            total: "3.50"
        };

        const isValid = await validateReceipt(receipt);
        expect(isValid).toBe(false);
    });

    // according to the rules, the total should be in the format of "d.dd"
    test('Rejects receipt without invalid total', async () => {
        const receipt: Receipt = {
            retailer: "Target",
            purchaseDate: "2022-05-15",
            purchaseTime: "10:00",
            items: [
            {
                shortDescription: "Apples",
                price: "3.50"
            }
            ],
            total: "3.5" // Incorrect total format
        };

        const isValid = await validateReceipt(receipt);
        expect(isValid).toBe(false);
    });
});