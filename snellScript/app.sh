#!/bin/bash

sleep 30

sudo yum update -y

sleep 15
sudo yum install -y gcc-c++ make

sleep 15
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

sleep 15
sudo yum install unzip -y
cd /home/ec2-user
sudo mkdir webservice
sudo mv /home/ec2-user/nodeApi.zip /home/ec2-user/webservice/nodeApi.zip
sudo chmod -R 777 webservice
cd webservice
sudo unzip nodeApi.zip

sleep 15
sudo npm i

sleep 15
sudo mv /tmp/nodeApi.service /etc/systemd/system/nodeApi.service
sudo systemctl enable nodeApi.service
# sudo systemctl start nodeApi.service