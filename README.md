# Webservice
``Restful API - Node.js``

## About the project
* Created an node application to perform CRU operations using http request, and continuous deployment to create EC2 instance using packer

## How To Run Node Application
* Download Node.js from the official site
* Clone the repository into your local machine using git clone command.
* Install pgAdmin on your device and set username and password, and also create a database and table</li>
* Go to your project folder using cd
* Write command npm i to install all dependencies
* Write command npm start to run the project locally
* Write command npm test to start the unit test
* Now run the apis using localhost/postman or any api library of choice
## How To Run Packer
* Download packer from the official site
* Clone the repository into your local machine using git clone command.
* Go to your packer folder using cd
* Write command packer init [packer file name] to install any plugins
* Write command packer validate -var-file=[variable file name] [packer file name] to validate packer file
* Write command packer build -var-file=[variable file name] [packer file name] to build ami instance in aws account
  
## Project Structure
* *api.js* : It has it's logic to create server http, routing system and the API services.
* *db.js* : It has database client information
* *controllers/createUser.js* : Main logic for creating users that includes create query
* *controllers/updateUser.js* : Main logic for updating users that includes update query
* *controllers/viewUser.js* : Main logic for view users that includes select query
* *controllers/uploadImg.js* : Main logic for uploading image to S3 that includes select, and delete query
* *controllers/getImg.js* : Main logic for viewing the exiting image in S3 that includes select query
* *controllers/deleteImg.js* : Main logic for deleting the exiting image from S3 that includes select, and delete query
* *tests/api.test.js* : Contains unit test for api test
* *tests/helper.test.js* : Contains unit test for helper function test
* *.github/workflows/eslint.js.yml*: Perform eslint test workflow
* *.github/workflows/test.js.yml*: Perform unit test workflow
* *.github/workflows/deploy.js.yml*: Perform continuous deployment workflow using packer
* *.github/workflows/validatePacker.js.yml*: Perform validate packer workflow
* *packer/app.sh*: Shell scripting to install and start node application service
* *packer/postgres.sh*: Shell scripting to install and start postgresql service
* *packer/var.json*: Contain parameter key and value of packer building file
* *packer/nodeApi.service*: Perform micro service of maintain the working of node application
* *packer/nodeApi.pkr.hcl*: Perform packer activity to build ec2 instances
  
## Teach Stack
* NodeJs
* ExpressJs Framework
* PostgreSQL
* Jest
* GitHub Action
* Packer
* Shell Script
* Microservice
* AWS

## Features
* Rest Apis
* Base Authentication
* Password Encryption
* Unit Testing
* GitHub Workflow testing for before and after PR merge 
* Microservice to maintain node and postgres application
* Building EC2 instance using Packer
* Upload, View, and Deleting image from S3
* GitHub Workflow to test the packer and deploying the instance in both dev and demo account

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
  
* /v1/user/pic :
  
  - *Methods: GET* : 
      - Description: Get Image Data.
      - Query Strings: none
      - url : /v1/user/self/pic
  - *Methods: POST* : 
      - Description: Upload Image Data.
      - Body: Multi-part form data binary string
      - url : /v1/user/self/pic
  - *Methods: DEL* : 
      - Description: Delete Image Data.
      - Query Strings: none
      - url : /v1/user/self/pic
## External Libraries
* bycrypt
* supertest
* packer
* express-fileupload
* dotenv
* aws-sdk
* uuid
* jest
