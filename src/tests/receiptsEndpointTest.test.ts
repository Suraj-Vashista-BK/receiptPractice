import request from 'supertest';
import { app } from '../index';


// This test suit mainly focuses on testing the endpoints provided in the clients perspective with different inputs.
describe('Test the receipt prcessing endpoint', () => {
  // TEST THE CREATION OF A RECEIPT
  const postEndPoint = '/receipts/process';
  const id: any=[];

  // valid receipt, should return 200
  it('should process a valid receipt and return an ID', async () => {
    const receiptData: any = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" }
      ],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(200);
    id.push(response.body.id);
    expect(response.body).toHaveProperty('id');
  });

  // valid receipt, should return 200
  it('should process a valid receipt and return an ID', async () => {
    const receiptData: any = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49"
        }, {
          shortDescription: "Emils Cheese Pizza",
          price: "12.25"
        }, {
          shortDescription: "Knorr Creamy Chicken",
          price: "1.26"
        }, {
          shortDescription: "Doritos Nacho Cheese",
          price: "3.35"
        }, {
          shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
          price: "12.00"
        }
      ],
      total: "35.35"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(200);

      id.push(response.body.id);
    expect(response.body).toHaveProperty('id');
  });

  // invalid receipt with a missing field, should return 400
  it('Receipt without retailer name', async () => {
    const receiptData = {
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" }
      ],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // invalid receipt with wrong date format, should return 400
  it('Receipt with wrong date format', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "01/01/2022",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" }
      ],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // invalid receipt with wrong time format, should return 400
  it('Receipt with wrong time format', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01 PM",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" }
      ],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // invalid receipt with no items, should return 400
  it('receipt with no items', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // No body post request, should return 400
  it('Receipt without retailer name', async () => {
    const response = await request(app)
      .post(postEndPoint)
      .expect(400);
  });

  // Empty post request, should return 400
  it('Receipt without retailer name', async () => {
    const receiptData = {};
    const response = await request(app)
      .post(postEndPoint)
      .expect(400);
  });


  // TEST THE RETRIEVAL OF A RECEIPT

  // valid receipt id from earlier creation, should return 200
  for (let i = 0; i < id.length; i++) {
    it('should return the points for a valid receipt ID', async () => {
      await request(app)
        .get(`/receipts/${id[i]}/points`)
        .expect(200);
    });
  }

  // Test for a non existing Id, should return 404
  it('should return 404 for a non existing receipt ID', async () => {
    await request(app)
      .get('/receipts/123/points')
      .expect(404);
  });


  // TEST THE VALIDATION OF THE RECEIPT


  // input satisfies all the rules
  it('should process a valid receipt and return an ID', async () => {
    const receiptData: any = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        { shortDescription: "Mountain Dew 12PK", price: "6.49" },
        { shortDescription: "Emils Cheese Pizza", price: "12.25" }
      ],
      total: "18.74"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(200);
    expect(response.body).toHaveProperty('id');
  });

  // according to the rules, the retailer name should only contain letters, numbers, spaces, hyphens, and ampersands
  test('Rejects receipt with invalid retailer name', async () => {
    const receiptData = {
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

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // according to the rules, the date should be in the format of "yyyy-mm-dd"
  test('Rejects receipt with invalid date format', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "05-15-2022",
      purchaseTime: "10:00",
      items: [
        {
          shortDescription: "Apples",
          price: "3.50"
        }
      ],
      total: "3.50"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // according to the rules, the time should be in the format of "hh:mm"
  test('Rejects receipt with invalid time format', async () => {
    const receiptData = {
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

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // according to the rules, the total should contain only 2 decimal places
  test('Rejects receipt without invalid total', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-05-15",
      purchaseTime: "10:00",
      items: [
        {
          shortDescription: "Apples",
          price: "3.50"
        }
      ],
      total: "3.5"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });


  // TESTING THE FACTUAL VALUES IN A VALID RECEIPT

  // logically incorrect date, should return 400
  test('Rejects receipt with invalid date that follow the initial format', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-02-30",
      purchaseTime: "10:00",
      items: [
        {
          shortDescription: "Apples",
          price: "3.50"
        }
      ],
      total: "3.5"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // logically incorrect time, should return 400
  test('Rejects receipt with logically incorrect time', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-13-99",
      purchaseTime: "99:99",
      items: [
        {
          shortDescription: "Apples",
          price: "3.50"
        }
      ],
      total: "3.5"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // price value is too high, should return 400
  test('Rejects receipt with unrealistically high price value', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-13-99",
      purchaseTime: "99:99",
      items: [
        {
          shortDescription: "Apples",
          price: "3000000000000000000000000000000000.00"
        }
      ],
      total: "3.5"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // total value is too high, should return 400
  test('Rejects receipt with unrealistically high total value', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-13-99",
      purchaseTime: "99:99",
      items: [
        {
          shortDescription: "Apples",
          price: "30.00"
        }
      ],
      total: "30009090909090909090.50"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

  // total value cannot be 0, should return 400
  test('Rejects receipt with total value 0', async () => {
    const receiptData = {
      retailer: "Target",
      purchaseDate: "2022-13-99",
      purchaseTime: "99:99",
      items: [
        {
          shortDescription: "Apples",
          price: "30.00"
        }
      ],
      total: "0.00"
    };

    const response = await request(app)
      .post(postEndPoint)
      .send(receiptData)
      .expect(400);
  });

});

