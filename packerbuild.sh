#!/bin/bash
sleep 30
sudo yum -y update
sudo yum install -y zip unzip
sleep 30
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
cd /tmp
unzip app_patch.zip
cd app_patch
sudo npm install bcrypt
sudo npm install
sudo npm install -g nodemon
