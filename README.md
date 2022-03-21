# webservice

This repo contains a web application with REST api calls using NodeJS framework and CI for building this Node app

Build Instructions:
1. Clone the repo using the git clone command
2. Run 'npm install' to install all the dev dependencies
3. Run the app using 'node server.js'
4. Use an api endpoint testing tool (preferably postman) and call the /healthz endpoint via local host listening on port 3000
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

RESTapi calls:
Use Postman to make the API calls and check for appropriate JSON responses.

POST : http://localhost:3000/v1/user/
1. Create a user by entering user details in JSON body of the request as follows,
   
   {
    "first_name" : "",
    "last_name" : "",
    "password" : "",
    "username" :  ""
   }

2. A 201 HTTP response would be returned if the user details are successfully created.
3. A valid email ID format should be used for username, otherwise a 400 response would be returned


GET : http://localhost:3000/v1/user/self
1. Enter the correct username and password of the created user in the Basic Authorization header
2. A successful call would return a JSON response with user details in the body

PUT : http://localhost:3000/v1/user/self
1. Enter the correct username and password of the created user in the Basic Authorization header
2. Enter the updated details in the JSON request body as follows,
   
   {
    "first_name" : "",
    "last_name" : "",
    "password" : ""
   }

3. Attempting to update any other field would result in a 400 response.


-- UPDATE --
1. Added packer template to create an AMI through github workflows that validate the packer template and build the AMI
2. Added supporting Bash scripts to integrate the application into AMI while building the AMI

