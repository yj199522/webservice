# #!/bin/bash

sleep 30
sudo yum update -y

sleep 15
sudo amazon-linux-extras install postgresql9.6

sleep 15
sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg13]
name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
baseurl=http://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

sleep 15
sudo yum install postgresql13 postgresql13-server -y
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb

sleep 15
sudo systemctl stop postgresql-13.service
sudo systemctl start postgresql-13.service
sudo systemctl enable postgresql-13.service

sudo -u postgres psql <<EOF
          \x
          ALTER ROLE postgres WITH PASSWORD '24100742y@sh';
          CREATE DATABASE "CloudAssignment";
          \q
EOF

sleep 15
sudo systemctl stop postgresql-13.service
sudo systemctl start postgresql-13.service
sudo systemctl status postgresql-13.service