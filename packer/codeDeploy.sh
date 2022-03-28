#!/bin/bash

sleep 30
sudo yum update

sleep 15
sudo yum install ruby wget -y

sleep 15
CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
$CODEDEPLOY_BIN stop
yum erase codedeploy-agent -y

sleep 15
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto

sleep 15
sudo service codedeploy-agent status
sudo service codedeploy-agent start
sudo service codedeploy-agent status