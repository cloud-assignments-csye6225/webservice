#!/bin/bash

# #give permission for everything in the express-app directory
# sudo chmod -R 777 /home/ubuntu/webApp

# #copying .env to webapp
# cp /home/ubuntu/.env /home/ubuntu/webApp

# #navigate into our working directory where we have all our github files
# cd /home/ubuntu/webApp

# #install node modules
# npm install

# #install nodemon
# #npm install nodemon

# #start our node app in the background
# npm start > app.out.log 2> app.err.log < /dev/null & 

cd /tmp/app_patch
sudo npm install bcrypt
sudo npm install
sudo npm install -g nodemon
sudo mv /tmp/app.service /etc/systemd/system/app.service
sudo systemctl enable app.service
sudo systemctl start app.service