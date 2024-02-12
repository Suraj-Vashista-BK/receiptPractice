# Receipt Processor Submission
A receipt processor app server is implemented that performs only 2 tasks
* processing a given receipt to calculate a score and assigning an ID to the receipt.
* providing a score for a given receipt ID.


## Technologies Used

- **Primary Language**: JavaScript (Node.js)
- **Framework**: Express
- **TypeScript**: For static type checking
- **Testing**: Jest for unit testing
- **Containerization**: Docker for easy setup and deployment

## How to run

Inorder to run this application, only `Docker Desktop` is the necessary pre-requisite.

The steps to follow are:
* Start `Docker Desktop`
* Execute the following commands one by one.
  ```
  git clone https://github.com/Suraj-Vashista-BK/ReceiptProcessor.git
  cd ReceiptProcessor
  docker-compose build
  docker-compose up
  ```

The application creates a container, installs necessary libraries, and conducts initial testing using Jest.

Access the application at 
```
http://localhost:3000/
```
The home page will display "Fetch Coding Exercise!".

## Key Assumptions

I have made some assumptions based on the schema provided in [api.yml](https://github.com/Suraj-Vashista-BK/ReceiptProcessor/blob/main/api.yml) file.

For the retailer name, the pattern `^[\\w\\s\\-]+$` is used, which matches letters, numbers, spaces, and hyphens only. However, in the example provided, `M&M Corner Market` is mentioned as valid, even though it contains `&`, which should technically not be allowed.

Considering that the testing scripts might contain this case, I made a small arrangement to the regex to allow `&` additionally. No other special characters are allowed. Therefore, the retailer name regex `^[\\w\\s\\-&]+$` allows letters, numbers, spaces, hyphens, and ampersands.


## Corner Cases

There can be a lot of corner cases for each input. The app covers a variety of corner cases with appropriate messages in response. For cases that dont have a dedicated message, the app gives a generic error message.

Some checks the app does for each field are as follows (strictly based on api.yml):
1. Retailer name:
   - Must be a string.
   - Cannot be empty.
   - Can only contain letters, numbers, spaces, hyphens, and ampersands. This is done based on the pattern `^[\\w\\s\\-&]+$` given in api.yml file along with the assumption mentioned in the previous section.
   - It is a required field
  
2. purchaseDate:
   - Must be a string.
   - Cannot be empty.
   - Must be in format `YYYY-MM-DD` with valid values. Values like 2020-00-00, 2024-02-31 etc are not allowed.
   - It is a required field.
   - Cannot be a future date.

3. purchaseTime:
   - Must be a string.
   - Cannot be empty.
   - Must be in format `HH:MM` (24 Hour Clock) with valid values. Values like 24:00, 99:99 etc are not allowed.
   - It is a required field.

4. Items:
   - Must be an array containing shortDescription and price.
   - Cannot be empty.
   - Must have a minimum of 1 field.
   - It is a required field.

5. shortDescription:
   - Must be a string.
   - Cannot be empty.
   - Can only contain letters, numbers, spaces, and hyphens. This is done based on the pattern `^[\\w\\s\\-]+$` given in api.yml file.
   - It is a required field.

6. price:
   - Must be a string ( following the api.yml).
   - Cannot be empty or NaN.
   - Must be decimal number with 2 decimal places. This restriction is based on the pattern `^\\d+\\.\\d{2}$` given in api.yml file.
   - It is a required field.
   - Cannot be negative.
   - Cannot be zero.
   - Cannot be more than `10e10`. This is a design choice to avoid unrealistic price values.
   - All the prices must add up to the total filed with an allowed error of 0.01

7. total:
   - Must be a string ( following the api.yml).
   - Cannot be empty or NaN.
   - Must be decimal number with 2 decimal places. This restriction is based on the pattern `^\\d+\\.\\d{2}$` given in api.yml file.
   - It is a required field.
   - Cannot be negative.
   - Cannot be zero.
   - Cannot be more than `10e10`. This is a design choice to avoid unrealistic total values.

*Note that the input JSON field names should not vary in spelling.*


## Application Details

### 1. Endpoints

The server exposes 2 endpoints

#### Endpoint 1: Processing receipt

* Path: `/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

Takes in a JSON body containing the reciept details that follows the following schema mentioned in [api.yml](https://github.com/Suraj-Vashista-BK/ReceiptProcessor/blob/main/api.yml) and a sample valid receipt is as shown below.

```json
{
    "retailer": "Target",
    "purchaseDate": "2022-01-02",
    "purchaseTime": "13:13",
    "total": "1.25",
    "items": [
        {"shortDescription": "Pepsi - 12-oz", "price": "1.25"}
    ]
}
```

The endpoint takes in this receipt data and calculates a score based on the rules provided in the instructions. A random uuid is generated for each reciept and is stored along with the calculated score in the memory.

In response, the API returns a JSON containing the receipt ID as shown below
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```

In case of an invalid receipt, we get the following response
```json
{"error": "The receipt is invalid"}
```

*Note that As per instructions, I have not used any database for storage. In memory storage has been used and the application does not persist data i.e all data is lost upon terminating the server. Since, the storage is in memory, I have chosen not to store the entire receipt. Only the ID and the score is stored as key-value pairs in the local cache. This design is opted because the instructions does not require me to allow updating existing receipts and hence storage of the entire receipt is not necessary.*


#### Endpoint 2: Get Receipt points

* Path: `/receipts/{id}/points`
* Method: `GET`
* Response: A JSON object containing the number of points awarded.

A simple Getter endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.

If a receipt with the provided ID is present, the following JSON response is returned:
```json
{ "points": 32 }
```
In case of an invalid receipt ID, we get the following response
```json
{"error": "No receipt found for that id"}
```

### 2. Input validation

Validations of provided receipt details input is performed in 2 steps:
* Typescript interfaces are used to ensure that each field is containing the right data type and no fields are missing.
* For each valid data type field, pattern checks are conducted using regex. The allowed patterns are described in the [api.yml](https://github.com/Suraj-Vashista-BK/ReceiptProcessor/blob/main/api.yml) components section and the application follows these patterns stricly. I have also explained all the expressions in detail under the Assumptions section.


### 3. Testing

Testing has been performed using jest ( a javascript testing library). I have designed the tests to check the following 3 areas:

* Score Validation: Tests are written to make sure that the given rules have been implemented properly and correct scores are assigned to receipts.
* EndPoint Validation: Tests are written to make sure that server endpoints provides appropriate HTTP response codes and descriptions for all different types of inputs.

A total of 24 tests are written that are auto executed upto docker build.

### 4. Logs

Considering this to be a small application, for simplicity I have only logged the details of the HTTP request to the console using a npm library called morgan.

## Accessing the server

Since the task was to build only a server, I have not created the UI assuming that Fetch has some scripts to test.

The following ways have been used and tested by me in order to access this server:
- Postman ( Sometimes there can be some latency in the first request sent via postman. This is an issue with postman and not the application ).
- curl

Sample curl commands used:

GET REQUEST:
```
curl --location 'http://localhost:3000/receipts/dc33fe6a-a7c8-4e4a-b964-b694662d97d3/points' --data ''
```
POST REQUEST:
```
curl --location 'http://localhost:3000/receipts/process' --header 'Content-Type: application/json' \
--data '{
  "retailer": "M&M Corner Market",
  "purchaseDate": "2022-01-21",
  "purchaseTime": "16:01",
  "items": [
    {
      "shortDescription": "Gatorade",
      "price": "1.00"
    }
  ],
  "total": "1.00"
}'```

