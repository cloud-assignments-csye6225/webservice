#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/webApp

#copying .env to webapp
cp /home/ubuntu/.env /home/ubuntu/webApp

#navigate into our working directory where we have all our github files
cd /home/ubuntu/webApp

#install node modules
npm install

#install nodemon
#npm install nodemon

#start our node app in the background
npm start > app.out.log 2> app.err.log < /dev/null & 

