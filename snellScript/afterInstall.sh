cd /home/ec2-user/webservice
pwd
sudo chmod -R 777 webservice
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo npm install --unsafe-perm=true --allow-root 