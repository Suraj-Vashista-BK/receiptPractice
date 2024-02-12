# Receipt Processor Submission
This repository contains the code pertaining to the challenge provided by fetch rewards for the backend engineer position.

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

Inorder to run this application, only `Docker` is the necessary pre-requisite.

The steps to follow are:
* Start `Docker Desktop`
* clone the respoitory using the command `git clone https://github.com/Suraj-Vashista-BK/ReceiptProcessor.git`
* execute `cd ReceiptProcessor`. This should navigate to the root directory which contains the Dockerfile.
* execute `docker-compose up` or `docker-compose up -d`

The application creates a container, installs necessary libraries, and conducts initial testing using Jest.

Access the application at `http://localhost:3000/`, displaying "Fetch Coding Exercise!".

## Key Assumptions

I have made some assumptions based on the schema provided in api.yml file.

For the retailer name, the pattern `^[\\w\\s\\-]+$` is used, which matches letters, numbers, spaces, and hyphens only. However, in the example provided, `M&M Corner Market` is mentioned as valid, even though it contains `&`, which should technically not be allowed.

Considering that the testing scripts might contain this case, I made small arrangement to the regex to allow `&` additionally. No other special characters are allowed. Therefore, the retailer name regex allows letters, numbers, spaces, hyphens, and ampersands.

This change is only done for retailer name field. Rest of the fields stricly follow the pattern mentioned in the api.yml elaborated below. 
* For date, the server only allows `yyyy-mm-dd`.
* For time, the server only allows `hh:mm`
* For prices and total, the server follows given regex `^\\d+\\.\\d{2}$` which matches strings that start with one or more digits, followed by a dot, and then exactly two digits, and nothing else.
* Item description follows `^[\\w\\s\\-]+$` which matches letters, numbers, spaces and hyphens.


## Application Details

### 1. Endpoints

The application exposes 2 endpoints

#### Endpoint 1: Processing receipt

* Path: `/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

Takes in a JSON body containing the reciept details that follows the following schema mentioned in api.yml and a sample valid receipt is as shown below.

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
* For each valid data type field, pattern checks are conducted using regex. The allowed patterns are described in the api.yml components section and the application follows these patterns stricly. I have also explained all the expressions in detail under the Assumptions section.


### 3. Testing

Testing has been performed using jest ( a javascript testing library). I have designed the tests to check the following 3 areas
* Input validation: Tests are written to make sure the validation function allows only the schema mentioned in api.yml file.
* Score Validation: Tests are written to make sure that the given rules have been implemented properly and correct scores are assigned to receipts.
* EndPoint Validation: Tests are written to make sure that server endpoints provides appropriate HTTP response codes and descriptions for all different types of inputs.


## Accessing the server

Since the task was to build only a server, I have not created the UI assuming that fetch has some scripts to test.

The following ways have been used and tested by me inorder to access this server:
- Postman
- curl

A sample curl command used
```
curl --location 'http://localhost:3000/receipts/dc33fe6a-a7c8-4e4a-b964-b694662d97d3/points' --data ''
```


