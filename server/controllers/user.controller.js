const db = require("../models");
const User = db.user;
const Vocabulary = db.vocabulary;

exports.getAll = (req, res) => {
  User.find({
    is_deleted: false
  })
    .select('_id username email roles')
    .then((user) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all user',
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

exports.getById = (req, res) => {
  User.findById(req.params.id)
    .select('_id username email roles')
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
  console.log("req.body.newWords",req.body.newWords);
  newWords = await Vocabulary.find({name: { $in: req.body.newWords }})
    .then(words => {
      return words
    })
    .catch((err) => {
      return []
    })
  console.log("newWords",newWords);
  User.findByIdAndUpdate(req.params.id, {
    $push: {
      category:  {
        $each : newWords
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