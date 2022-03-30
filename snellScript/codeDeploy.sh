#!/bin/bash

sleep 15
sudo yum update

sleep 15
sudo yum install ruby wget -y

sleep 15
sudo CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
sudo $CODEDEPLOY_BIN stop
sudo yum erase codedeploy-agent -y

sleep 15
sudo wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto

sleep 15
sudo service codedeploy-agent status
sudo service codedeploy-agent start
sudo service codedeploy-agent status