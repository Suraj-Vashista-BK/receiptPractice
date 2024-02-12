import request from 'supertest';
import { app } from '../index';


// This test suit mainly focuses on testing the endpoints provided in the clients perspective
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

});

