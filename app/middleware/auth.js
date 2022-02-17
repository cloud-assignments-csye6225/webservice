const db = require("../models");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User = db.users;
const Image = db.images;

module.exports = (req, res, next) => {
  var authHeader = req.headers.authorization;

  if (!authHeader) {
    var err = new Error("You are not authenticated");

    res.setHeader("WWW-Authenticate", "Basic");

    err.status = 401;
    err.message="User is not authenticated";
    res.status(401).send(err.message);
  }

  var auth = new Buffer(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  var username = auth[0];

  var password = auth[1];


User.findOne({
  where: {
    username
  }
}).then(result => {

  const verified = bcrypt.compareSync(password, result.password);
 
  // Bcrypt.validate()
  // User passoword - auth[1]
  // DB password result.password
  // validate 1st and 2nd
  console.log(verified);
  // Req.method === 'GET'
  if (!verified) {
    var err = new Error("You are not authenticated");

    res.setHeader("WWW-Authenticate", "Basic");

    err.status = 401;
    err.message = "User is not authenticated";
    res.status(401).send(err.message);
  }
  else {
    console.log(req.method);
    if (req.method === 'GET') {
      global.username=result.username;
      next();
      // res.status(200).send({id:result.id,
      //   first_name :result.first_name,
      //   last_name:result.last_name,
      //   username:result.username,
      //   account_created: result.account_created,
      //   account_updated: result.account_updated})
    }
    else if(req.method === 'POST' ){
      global.username=result.username;
      next();
    }
    else if(req.method === 'DELETE'){
      global.username=result.username;
      next();
    }
    else if (req.method === 'PUT') {
      // Update DB with new req.body
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
          res.status(400).send();
        }
        else{
          const id = result.id;
      
      if (req.body.username) {
        res.status(400).send({message: "Username not cannot be updated"});
        return;
      }
      if (req.body.account_created) {
        res.status(400).send({message: "account_created not cannot be updated"});
        return;
      }
      if (req.body.account_updated) {
        res.status(400).send({message: "account_updated not cannot be updated"});
        return;
      }
      const userUpdate = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hash
    }
      User.update(userUpdate,{
        where:{
          id: result.id
        } 
      }).then(data => {
        res.status(204).send()
      })

        }
      })
      
      
    }else{
      req.status(400).send();
    }
    // else if(req.method == 'POST'){
    //   console.log(req.fieldname)
    //   var storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
      
    //         // Uploads is the Upload_folder_name
    //         cb(null, "uploads")
    //     },
    //     filename: function (req, file, cb) {
    //       cb(null, file.fieldname + "-" + Date.now()+".jpg")
    //     }
    //   })
           
    //   // Define the maximum size for uploading
    //   // picture i.e. 1 MB. it is optional
    //   const maxSize = 1 * 1000 * 1000;
        
    //   var upload = multer({ 
    //     type: Buffer,
    //     storage: storage,
    //     limits: { fileSize: maxSize },
    //     fileFilter: function (req, file, cb){
            
    //         // Set the filetypes, it is optional
    //         var filetypes = /jpeg|jpg|png/;
    //         var mimetype = filetypes.test(file.mimetype);
      
    //         var extname = filetypes.test(path.extname(
    //                     file.originalname).toLowerCase());
            
    //         if (mimetype && extname) {
    //             return cb(null, true);
    //         }
          
    //         cb("Error: File upload only supports the "
    //                 + "following filetypes - " + filetypes);
    //       } 
      
    //   // mypic is the name of file attribute
    //   }).single("file_name");
      
    //   Image.uploadimage = (req, res) => {
    //       upload(req, res, function(err) {
    //         if(err){
    //           console.log("error block")
    //           res.send(err)
    //         }
    //         else{
    //           console.log(req.file)
    //           res.send("Success!")
    //         }
    //       })
    //   }
    // }
    }
    
  // Update user
  // next()

})


  // if (username == req.body.username && password == req.body.password) {
  //   next();
  // } else {
  //   var err = new Error("You are not authenticated");

  //   res.setHeader("WWW-Authenticate", "Basic");

  //   err.status = 401;
  //   err.message = "User is not authenticated";
  //   res.status(401).send(err.message);
    
  // }
}

// module.exports = auth;
