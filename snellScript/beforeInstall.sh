#!/bin/bash

sleep 10
sudo systemctl stop nodeApi.service
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a stop
cd /home/ec2-user
sudo rm -rf webservice node_modules package-lock.json nodeApi.zip