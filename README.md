# Webservice 
``Restful API - Node.js``

## About the project
Created an node application to perform basic api using express

## How To Run
* Download Node.js from the official site
* Clone the repository into your local machine using git clone command.
* Go to your project folder using cd
* Write command npm i to install all dependencies
* Write command node index.js to run the project locally
* Now run the apis using localhost/postman or any api library of choice
  
## Project Structure
* *index.js* : It has it's logic to create server http and https and the API services.
* *api.js* : Contain the basic node application 
* *tests/api.test.js* : test/api.test.js: Contains unit test
* *.github/workflows/test.js.yml*: Perform unit test workflow
* *.github/workflows/eslint.js.yml*: Perform eslint test workflow
  
## Teach Stack
* NodeJs
* ExpressJs
* Jest
* GitHub Action

## Features
* Rest Apis
* Unit Testing
* GitHub Workflow testing for before and after PR merge 

## Endpoints
/healthz :

- *Methods: GET* : 
    - Description: Simple GET api to test.
    - url : /healthz

## External Libraries
supertest
