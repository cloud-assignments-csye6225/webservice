#!/bin/bash

cd /tmp/app_patch
sudo npm install bcrypt
sudo npm install
sudo npm install -g nodemon
sudo mv /tmp/app.service /etc/systemd/system/app.service
sudo systemctl enable app.service
sudo systemctl start app.service