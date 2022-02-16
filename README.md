# Webservice
``Restful API - Node.js``

## About the project
Created an node application to perform CRU operations using http request

## How To Run
* Download Node.js from the official site
* Clone the repository into your local machine using git clone command.
* Install pgAdmin on your devise and set username and password, and also create a database and table</li>
* Go to your project folder using cd
* Write command npm i to install all dependencies
* Write command npm start to run the project locally
* Write command npm test to start the unit test
* Now run the apis using localhost/postman or any api library of choice
  
## Project Structure
* *api.js* : It has it's logic to create server http and https, routing system and the API services.
* *db.js* : It has database client information
* *controllers/createUser.js* : Main logic for creating users that includes create query
* *controllers/updateUser.js* : Main logic for updating users that includes update query
* *controllers/viewUser.js* : Main logic for view users that includes select query
* *tests/api.test.js* : Contains unit for api test
* *tests/helper.test.js* : Contains unit helper function test
* *.github/workflows/eslint.js.yml*: Perform eslint test workflow
* *.github/workflows/test.js.yml*: Perform unit test workflow
  
## Teach Stack
* NodeJs
* ExpressJs Framework
* PostgreSQL
* Jest
* GitHub Action

## Features
* Rest Apis
* Base Authentication
* Password Encryption
* Unit Testing
* GitHub Workflow testing for before and after PR merge 

## Endpoints
* /healthz :

  - *Methods: GET* : 
      - Description: Simple GET api to test.
      - url : /healthz

* /v1/user :
  
  - *Methods: GET* : 
      - Description: Get User Data.
      - Query Strings: none
      - url : /v1/user/self
  - *Methods: POST* : 
      - Description: Create a new user.
      - Body: first_name, last_name, username, password
      - url : /v1/user
  - *Methods: PUT* : 
      - Description: Update a user.
      - Body: first_name, last_name, password
      - url : /v1/user/self

## External Libraries
* bycrypt
* supertest