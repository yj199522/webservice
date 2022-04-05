# #!/bin/bash

sleep 10
cd /home/ec2-user/webservice
sudo chmod +x webservice
sudo chmod 777 logs/app.log
sudo systemctl start nodeApi.service