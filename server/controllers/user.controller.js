const { response } = require("express");
const db = require("../models");
const User = db.user;
const Vocabulary = db.vocabulary;

exports.getAll = (req, res) => {
  User.find({
    is_deleted: false
  })
    .select('_id username email roles')
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
}

exports.getById = (req, res) => {
  User.findById(req.params.id)
    .aggregate()
    .select('_id username email roles is_deleted')
    .then((user) => {
      return res.status(200).json({
        success: true,
        message: 'User',
        data: user,
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

exports.addNewWords = async (req, res) => {
  console.log("req.body.newWords", req.body.newWords);
  newWords = await Vocabulary.find({ name: { $in: req.body.newWords } })
    .then(words => {
      return words
    })
    .catch((err) => {
      return []
    })
  console.log("newWords", newWords);
  User.findByIdAndUpdate(req.params.id, {
    $push: {
      category: {
        $each: newWords
      }
    }
  })
    .then((dataR) => {
      return res.status(200).json({
        success: true,
        message: 'Added new words !',
        data: dataR,
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
// delete User
exports.deleteUser = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: {
      is_deleted: true
    }
  })
    .then(response => {
      return res.status(200).json({
        success: true,
        message: 'Deleted user successful',
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    })

}

// update User
exports.updateUser = async (req, res) => {
  const updateUser = {
    name: req.body.name,
    email: req.body.email,
  }
  newWords = await User.findByIdAndUpdate(req.params.id, {
    $set: updateUser
  })
    .then(response => {
      return res.status(200).json({
        success: true,
        message: 'Updated user successful',
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });

    })
}