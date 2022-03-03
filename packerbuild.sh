#!/bin/bash
sudo yum update -y
sudo yum upgrade -y
sudo yum install nginx -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install nodejs -y
cd /tmp
unzip app_patch.zip
cd app_patch
sudo npm install
