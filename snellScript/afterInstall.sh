cd /home/ec2-user/webservice
pwd
sudo chmod -R 777 webservice
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo npm install --unsafe-perm=true --allow-root 

sleep 10
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/webservice/amazon-cloudwatch-agent.json -s