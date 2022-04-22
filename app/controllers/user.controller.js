const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { users } = require("../models");
const db = require("../models");
const User = db.users;
const Image = db.images;
const Op = db.Sequelize.Op;
const uploadFile = require("../middleware/upload");
const {uploadFileToS3} = require("../../s3");
const {deleteFileFromS3} = require("../../s3");
const fs = require("fs");
const util = require('util');
const baseUrl = "http://localhost:3000/v1/self/pic";
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const log = require("../../log4js")
const logger = log.getLogger('log4js');
var StatsD = require('node-statsd'),
sdc = new StatsD();
const crypto = require('crypto');
const dynamo = require('../config/dynamodb.config');
const sns = require('../config/sns.config');

// Create and Save a new User
exports.create = (req, res) => {
  sdc.increment('sdc_api_1'); //statsd counter metric
  logger.info("[INFO]: Create user api endpoint is called");
    // Validate request
    if (!req.body.first_name) {
      logger.info("[ERROR] 400: First name null")
      res.status(400).send();
      return;
    }
    else if(!req.body.last_name){
      logger.info("[ERROR] 400: Last name null")
      res.status(400).send();
      return; 
    }
    else if(!req.body.username){
      logger.info("[ERROR] 400: Email null")
      res.status(400).send();
      return; 
    }
    else if(!req.body.password){
      logger.info("[ERROR] 400: Password null")
      res.status(400).send();
      return; 
    }

    bcrypt.hash(req.body.password, 10, (err,hash) => {
        if(err){
            res.status(500).json({
                error: err,
                message : "Some error occurred while creating the user"
            });
        }
        else{
          logger.info("[INFO]: Creating User object")
            const userObject = {
                id: req.body.id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hash
            }

            
                    // }).catch((err) => {
                    //     //Internal server error
                    //     logger.info("[ERROR] 406: Something went wrong")
                    //     console.log(err.stack);
                    //     res.status(406).json({
                    //         message : err.message
                    //     });

            User.create(userObject)
            .then(data => {
              logger.info("[INFO]: Sending User object for verification")
              const token = crypto.randomBytes(16).toString("hex");
              //Add record in DynamoDB
              const putParams = {
                  TableName: process.env.DYNAMODBTABLENAME,
                  Item: {
                      'username': {S: data.dataValues.username},
                      'token': {S: token},
                      'ttl': {N: (Math.floor(+new Date() / 1000) + 120).toString()}
                  }
              }
              dynamo.dynamoDBClient.putItem(putParams, (err, putItemResponse) => {
                  if (err) {
                      logger.info(`[ERROR]: ${err.message}`)
                      res.status(504).json({
                          message : err.message
                      });
                  } else {
                      logger.info(`[INFO]: New user token uploaded to DynamoDB : ${token}`)
                      //Publish in Amazon SNS
                      const message = {
                          Message: `Email Verification Request`, /* required */
                          TopicArn: process.env.SNSTOPICARN,
                          MessageAttributes: {
                              'username': {
                                  DataType: 'String',
                                  StringValue: data.username
                              },
                              'token': {
                                  DataType: 'String',
                                  StringValue: token
                              }
                      }};
                      sns.publishTextPromise.publish(message).promise().then(
                          function (data) {
                              logger.info(`[INFO]: Message ${message.Message} sent to the topic ${message.TopicArn}`);
                              logger.info("[INFO]: MessageID is " + data.MessageId);
                              console.log(data.id)
                              const dataNew = {
                                id : data.id,
                                first_name : req.body.first_name,
                                last_name : req.body.last_name,
                                username : req.body.username,
                                account_created: data.account_created,
                                account_updated: data.account_updated
                              }                
                res.status(201).send(dataNew);
                          }).catch(
                          function (err) {
                              logger.info(`[ERROR]: ${err.message}`)
                              console.log("sns error")
                              res.status(504).send();
                          });
                  }
              })

                
            })
            .catch(err => {
                res.status(400).json({
                  message: "Catching error"
                });      
            });
        }
    } )

  };

// // Retrieve all Users from the database.
// exports.findAll = (req, res) => {
//   const id = req.query.id;
//   var condition = id ? { id: { [Op.iLike]: `%${id}%` } } : null;

//   User.findAll({ where: condition })
//     .then(data => {
//       res.status(200).send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Users."
//       });
//     });
// };

// Find a User with an id
exports.findOne = (req, res) => {
  console.log('Finding one', res.locals);
  User.findByPk(req.params.id)
    .then(data => {
      res.status(200).send({
        id: data.id,
        first_name : data.first_name,
        last_name: data.last_name,
        username: data.username
      });
    })
    .catch(err => {
      res.status(500).send({
        error: err,
        message: "Error retrieving user with id=" + id
      });
    });
};

// Update a User by the id in the request


exports.update = (req, res) => {
  sdc.increment('sdc_api_3'); //statsd counter metric
  logger.info("[INFO]: Update user api endpoint is called");

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err){
      res.status(400).json({
        
        message : "Choose a user ID to update"
      });
    }
    else if(req.params.id == null){
      res.status(400).json({
        message: "Choose a user ID to update"
      })
    }
    else{
      const id = req.params.id;
      
      if (req.body.username) {
        res.status(400).send({
          message: "Username cannot be updated"
        });
        return;
      }
      if (req.body.account_created) {
        res.status(400).send({
          message: "account_Created cannot be updated"
        });
        return;
      }
      if (req.body.account_updated) {
        res.status(400).send({
          message: "account_updated cannot be updated"
        });
        return;
      }
      const userUpdate = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hash
      }
      User.update(userUpdate, {
        where: { id: id}
       })
      .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "User was updated successfully."
         });
        } else {
          res.status(400).send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
     .catch(err => {
       res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });

    }


  })  
};


//Creating Image DB

exports.createImage = async (req, res, location) => {
  // await User.upload(req.body);
  // console.log(req.body)
  const user = await this.findUser(global.username)
  const imageData = ( {
    
    file_name: req.file_name,
    id: user.id,
    url: location,
    upload_date: new Date(),
    user_id: user.id,

  })
  // console.log(imageData)
  const imageExists = await this.findImageByUserID(user.id)
  if(imageExists){
    await Image.update(imageData,{
      where:{
        id:imageExists.id
      }
    })
  }else{
    await Image.create(imageData)
  }
  return imageData
}


// Uploading Image

exports.upload = async (req, res) => {
  sdc.increment('sdc_api_4'); //statsd counter metric
  bodyParser.raw({
        limit: "3mb",
        type: ["image/*"],
    })
    console.log(req.body)
    if(!req.body){
      return res.status(400).send();
    }
  try {
    const file = req.file
    
    
      const result = await uploadFileToS3(req, res);
    const random = Math.floor(Math.random())
    const imageObject = {
      file_name: result.Key,
      url: result.Location
    }
    req.file_name = result.Key
    const location = result.Location
    const imageInfo = await this.createImage(req, res, location)

    res.status(201).send(imageInfo)
    
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    return res.status(400).send();
    
  }
};

exports.getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

//find user by username



exports.findUser=async(username)=>{
  let result = await User.findOne({
    where: {
        username: username
    }
  });
return result;
}

// end find user by email id

//find image by userId

exports.findImageByUserID=async(userId)=>{
  let result = await Image.findOne({
    where: {
        user_id: userId
    }
  });
return result;
}

//fetch user data
exports.fetchUserData=async(req, res)=>{
  sdc.increment('sdc_api_2'); //statsd counter metric
  let result = await User.findOne({
    where: {
      username:global.username
    }
  });

  if (result.dataValues.status === "Verified") {
    logger.info(`[INFO]: User email id is verified`)
    res.status(200).send({id:result.id,
      first_name :result.first_name,
      last_name:result.last_name,
      username:result.username,
      account_created: result.account_created,
      account_updated: result.account_updated
    });
  } else {
    logger.info(`[ERROR]: User email id not verified`)
    res.status(403).json({
        success: false,
        message: "Please verify your email id"
    })
}

  
}

//fetch image data by username

exports.fetchImageByUsername=async(req, res)=>{
  sdc.increment('sdc_api_5'); //statsd counter metric
  let result = await User.findOne({
    where: {
      username:global.username
    }
  });
  let result1 = await Image.findOne({
    where: {
      user_id:result.id
    }
  });
  if(!result1){
    res.status(404).send();
  }
  res.status(200).send({
    file_name: result1.file_name,
    id: result1.id,
    url: result1.url,
    upload_date: result1.upload_date,
    user_id: result1.user_id
  })

}

//delete image data by userId

exports.deleteImageByUserId=async(req, res)=>{
  sdc.increment('sdc_api_6'); //statsd counter metric

  let result = await User.findOne({
    where: {
      username:global.username
    }
  });
  let result1 = await Image.destroy({
    where: {
        user_id:result.id
    }
  });
  await deleteFileFromS3(req,res,result);
  if(!result1){
    res.status(404).send("Profile picture doesn't exist to delete!")
  }
  res.status(204).send()
}





// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
  sdc.increment('sdc_api_7'); //statsd counter metric
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "User was deleted successfully!"
        });
      } else {
        res.status(400).send({
          message: `Cannot delete User with id=${id}. User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.status(200).send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

exports.verifyUser = (req, res) => {
  logger.info("[INFO]: VerifyUser endpoint hit")
  db.User.findOne({
      where: {username: req.query.email}
  }).then(async (response) => {
      if (response == null) {
          //User not present
          logger.info("[ERROR] 400: User not found")
          res.status(400).send();
      } else {
          metrics.increment('User.PUT.User_Verification')
          //Get token from DynamoDB
          const getParams = {
              TableName: process.env.DYNAMODBTABLENAME,
              Key: {
                  "username": {S: response.dataValues.username}
              }
          }
          dynamo.dynamoDBClient.getItem(getParams, (err, getResponseItem) => {
              if (err) {
                  logger.info(`[ERROR]: ${err.message}`);
                  res.status(504).send();
              } else {
                  logger.info(`[INFO]: User verification token retrieved from DynamoDB`);
                  if(getResponseItem.Item === undefined){
                    response.status(400).json({
                      message: "Link expired"
                    })
                  }
                  if (getResponseItem.Item.token.S === req.query.token && Math.floor(Date.now()/1000) < getResponseItem.Item.ttl.N) {
                      delete response.dataValues.password;
                      const updatedUser = {
                          ...response.dataValues,
                          status : "Verified"
                      }
                      console.log(updatedUser);
                      response.update(updatedUser).then(updatedUser => {
                          logger.info(`[INFO]: User email id verified`)
                          res.status(204).send();
                      });
                  } else {
                      logger.info(`[ERROR]: Token mismatch`)
                      res.status(400).json({
                          success: false,
                          message: "DDB Token and Params Token mismatch"
                      });
                  }
              }
          })
      }
  });
}