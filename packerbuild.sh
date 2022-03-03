#!/bin/bash
sleep 30
sudo yum -y update
sudo yum install -y zip unzip
sudo mv /tmp/pgdg.repo /etc/yum.repos.d/pgdg.repo
sudo yum install postgresql13 postgresql13-server -y
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
sleep 30
sudo systemctl enable --now postgresql-13
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'kartheek';"
sudo -u postgres psql -c 'CREATE DATABASE user_db';
sudo -u postgres psql -c '\c user_db';
sudo -u postgres psql -c 'CREATE TABLE users (id VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, account_created VARCHAR(255), account_updated VARCHAR(255))';
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
cd /tmp
unzip app_patch.zip
cd app_patch
sudo npm install bcrypt
sudo npm install
sudo npm install -g nodemon
sudo mv /tmp/app.service /etc/systemd/system/app.service
sudo systemctl enable app.service
sudo systemctl start app.service