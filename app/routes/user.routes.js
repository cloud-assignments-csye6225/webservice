const bodyParser = require("body-parser");
const { Sequelize } = require("../models/index.js");

module.exports = app => {
    const user = require("../controllers/user.controller.js");
    const auth = require("../middleware/auth")
    const multer = require('multer');
    const bodyParser = require('body-parser')
    const uploadFileToS3 = require("../../s3")
    var router = require("express").Router();
  
    // Create a new User
    router.post("/user", user.create);
    
    // Verify user sign up
    router.get("/verifyUserEmail", user.verifyUser);
    
    // Retrieve a single User with id
    router.get("/user/self", auth, user.fetchUserData);

  
    // Update a User with id
    router.put("/user/self", auth, user.update);

    // Adding/Updating a picture for a user

    router.post("/user/self/pic",auth, user.upload);
   

    // Retrieve a user image

    router.get("/user/self/pic", auth, user.fetchImageByUsername);

    //delete image by userId

    router.delete("/user/self/pic",auth,user.deleteImageByUserId);

    // router.post("/self/pic", (req, res, next) => {
    //   console.log(req.body)
    //   const imageData = {
    //     name: req.body.name
    //   };    
    // }, user.upload);

    // Deleting a User image

    router.delete("/user/self/pic", user.delete);

  
    // Delete a User with id
    // router.delete("/:id", user.delete);
  
    // // Delete all User
    // router.delete("/", user.deleteAll);


    
    app.use("/v1", router);

    // ROUTE TO POST IMAGE


    // app.post("/self/pic", function(req, res, next) {
    //   var data = new Buffer('');
    //   req.on('data', function(chunk) {
    //       data = Buffer.concat([data, chunk]);
    //   });
    //   req.on('end', function() {
    //     req.rawBody = data;
    //     res.send("Success");
    //     next();
    //   });
    // });

  };