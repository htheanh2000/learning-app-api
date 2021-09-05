const config = require("../config/auth.config");
const db = require("../models");
const Vocabulary = db.vocabulary;

exports.create = (req, res) => {
  const vocabulary = new Vocabulary({
    name: req.body.name,
    meaning: req.body.meaning,
    type: req.body.type
  });
  vocabulary.save(err => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({
      success: true,
      message: "Vocabulary was created successfully!",
      data: vocabulary
    });
  });
};

exports.getAll = (req, res) => {
  Vocabulary.find({
    is_deleted: false
  })
    .select('_id name meaning type')
    .then((vocabulary) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all vocabulary',
        vocabulary: vocabulary,
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
  const id = req.params.id;
  Vocabulary.findById(id)
    .then((vocabulary) => {
      return res.status(200).json({
        success: true,
        message: 'Vocabulary',
        vocabulary: vocabulary,
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

exports.update = (req, res) => {
  const id = req.params.id;
  const updateVocabulary = {
    name: req.body.name,
    meaning: req.body.meaning,
    type: req.body.type
  };

  Vocabulary.updateOne({ _id:id }, { $set:updateVocabulary })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Vocabulary is updated',
        updateCourse: updateVocabulary,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });

}

exports.delete = (req, res) => {
  const id = req.params.id;
 
  Vocabulary.updateOne({ _id:id }, { $set:{
    is_deleted: true
  } })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Vocabulary is deleted',
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err
      });
    });

}
