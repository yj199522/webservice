# Webservice 
``Restful API - Node.js``

## About the project
* Created a node application to perform CRU operations using an HTTP request, and continuous deployment by uploading the most recent code base of the application in form of the zip file in S3 using this zip we will deploy the application using Codedeploy Agent

## How To Run Node Application
* Download Node.js from the official site
* Clone the repository into your local machine using the git clone command.
* Install pgAdmin on your device and set username and password, and also create a database and table</li>
* Go to your project folder using cd
* Write command npm install to install all dependencies
* Write command npm start to run the project locally
* Write command npm test to start the unit test
* Now run the APIs using localhost/postman or any API library of choice
## How To Run Packer
* Download packer from the official site
* Clone the repository into your local machine using the git clone command.
* Go to your packer folder using cd
* Write command packer init [packer file name] to install any plugins
* Write command packer validate -var-file=[variable file name] [packer file name] to validate packer file
* Write command packer build -var-file=[variable file name] [packer file name] to build ami instance in AWS account
  
## Project Structure
* *api.js* : It has its logic to create server HTTP, routing system, and API services.
* *db.js* : It has the database client information
* *controllers/createUser.js* : Main logic for creating users that include create query
* *controllers/updateUser.js* : Main logic for updating users that include update query
* *controllers/viewUser.js* : Main logic for view users that includes select query
* *controllers/uploadImg.js* : Main logic for uploading an image to S3 that includes select, and delete query
* *controllers/getImg.js* : Main logic for viewing the exiting image in S3 that includes select query
* *controllers/deleteImg.js* : Main logic for deleting the exiting image from S3 that includes select, and delete query
* *tests/api.test.js* : Contains unit test for API test
* *tests/helper.test.js* : Contains unit test for helper function test
* *.github/workflows/eslint.js.yml*: Perform eslint test workflow
* *.github/workflows/test.js.yml*: Perform unit test workflow
* *.github/workflows/deploy.js.yml*: Perform continuous deployment workflow using codeDeploy Agent
* *.github/workflows/amiBuild.js.yml*: Perform AMI build in AWS account
* *.github/workflows/validatePacker.js.yml*: Perform validate packer workflow
* *snellScript/app.sh*: Shell scripting to install and start node application service
* *snellScript/postgres.sh*: Shell scripting to install and start PostgreSQL service
* *snellScript/codeDeploy.sh*: Shell scripting to install and start codeDeploy agent in EC2
* *snellScript/afterInstall.sh*: Shell scripting to install application requirement in EC2
* *snellScript/BeforeInstall.sh*: Shell scripting to remove the previous instance of application file from EC2
* *snellScript/applicationStart.sh*: Shell scripting to start the application
* *snellScript/nodeApi.service*: Perform microservice to maintain the working of the node application
* *packer/var.json*: Contain parameter key and value of packer building file
* *packer/nodeApi.pkr.hcl*: Perform packer activity to build ec2 instances
* *appspec.yml*: Contain information about what step to be performed by the code deploy agent when launching
  
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
* AWS S3
* AWS CodeDeploy Agent

## Features
* Rest Apis
* Base Authentication
* Password Encryption
* Unit Testing
* GitHub Workflow testing for before and after PR merge 
* Microservice to maintain node and Postgres application
* Building EC2 instance using Packer
* Upload, View, and Deleting images from S3
* GitHub Workflow to test the packer and deploy the instance in both dev and demo accounts
* Uploading the most recent code base of the application in the form of a zip file in AWS S3
* Fetching the uploaded zip file from S3 to continuously deploying the application using Codedeploy Agent

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
