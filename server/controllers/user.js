const mongoose = require('mongoose') ;
const User = require('../models/user')

// create new cause
 function createUser (req, res) {
    const user = new User({
      _id: mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
    });
    
    return user
      .save()
      .then((newUser) => {
        return res.status(201).json({
          success: true,
          message: 'New user created successfully',
          User: newUser,
        });
      })
      .catch((error) => {
          console.log(error);
        res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: error.message,
        });
      });
  }

  function getAllUser( req, res){
    User.find()
      .select('_id username email')
      .then((allUser) => {
        return res.status(200).json({
          success: true,
          message: 'A list of all user',
          Course: allUser,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: 'Server error. Please try again.',
          error: err.message,
        });
      });
  }
  

  module.exports = { createUser,getAllUser }