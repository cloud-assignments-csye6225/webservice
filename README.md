# webservice

This repo contains a REST api call using NodeJS framework and CI for building this Node app

Build Instructions:
1. Clone the repo using the git clone command
2. Run 'npm install' to install all the dev dependencies
3. Run the app using 'node index.js'
4. Use an api endpoint testing tool (preferably postman) and call the /healthz endpoint via local host     listening on port 3000
5. A http response status 200 would be returned upon successful API call

Testing Instructions:
1. Run the app using 'node index.js'
2. Open a new terminal and run the test cases using 'npm test' command
3. Infer the test case outputs (Should have 1 passing test)

CI Instructions:
1. Update the code if necessary and push it to the repo remotely
2. Create a PR to the main branch and wait for the status checks
3. Upon successful execution of the workflows, You shall be granted access to merge the PR to main branch
   (You will not be able to merge the PR if any of the status checks fail) 