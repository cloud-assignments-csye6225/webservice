var express = require("express");
var app = express();


app.get("/healthz", (req, res, next) => {
    res.json("You have reached the /health endpoint");
    res.status(200);
   });
   

app.listen(3000, () => {
 console.log("Web service for CSYE6225 : Listening on port 3000");
});