
const mongoose =  require('mongoose')
const db = require("../models");
const User = db.user;
const ObjectId = mongoose.Types.ObjectId;

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

exports.getById = async(req, res) => {
  const {id} = req.params
  const info =  await User.findById(id)
  .select('username email')
  .then((info) => info)
  const category = await User.aggregate([
      { $match : { _id : ObjectId(id)}} ,
      {$project: {"is_deleted" : 0, "__v" : 0 , "password": 0, "roles" : 0}},
      {
        $lookup:
        {
          from: "vocabularies",
          localField: "category" ,
          foreignField:  "_id" ,
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          includeArrayIndex: "arrayIndex"
        }
      },
      {
        $group: {
          _id:  "$category.type",
          type: {$first: "$category.type"},
          count : {$sum: 1}
        }
      }
    ])
    .then((category) => {
      return category
    })
    .catch((err) => {
      return []
    });
    console.log(info);
    res.status(200).json({
        username: info.username,
        email: info.email, 
        category
    })
}


// Add newWord to User 

exports.addNewWords = async (req, res) => {
  console.log("req.body.newWords", req.body.newWords);
  const {newWords} = req.body
  const {id} = req.params
  User.findByIdAndUpdate(id, {
    $addToSet: {
      category: {
        $each: newWords
      }
    }
  })
    .then(() => {
      return res.status(200).json({
        success: true,
        message: 'Added new words !',
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
    username: req.body.username,
    email: req.body.email,
  }
  await User.findByIdAndUpdate(req.params.id, {
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


exports.getTranslateExercise = (req, res) => {
  const response = [
      {
        id: 1,
        question: 'Xin ch??o',
        answer: 'H E L L O' ,
        random: 'E L O H L'
      },
      {
        id: 2,
        question: 'Con m??o',
        answer: 'C A T' ,
        random: 'A C T'
      },
      {
        id: 3,
        question: 'Con ch??',
        answer: 'D O G' ,
        random: 'G O D'
      },
      {
        id: 4,
        question: 'Con heo',
        answer: 'P I G' ,
        random: 'P G I'
      },
      {
        id: 5,
        question: 'Con chim',
        answer: 'B I R D' ,
        random: 'B I D I'
      },
      {
        id: 6,
        question: 'T???m bi???t',
        answer: 'G O O D B Y E' ,
        random: 'O O D G E Y B'
      },
      {
        id: 7,
        question: 'B??t ch??',
        answer: 'P E N C I L' ,
        random: 'P N E C L I'
      },
      {
        id: 8,
        question: 'Con b??',
        answer: 'C O W' ,
        random: 'C W O'
      },
      {
        id: 9,
        question: 'Con ki???n',
        answer: 'A N T' ,
        random: 'T A N'
      },
      {
        id: 10,
        question: 'S??ng',
        answer: 'G U N' ,
        random: 'G N U'
      }
  ]

  res.json({
    success: true,
    data: response
  })
}


exports.getChooseCorrectExercise = (req, res) => {
  const response = [
      {
        id: 1,
        question: 'Dog',
        answers: [
          {
            id: 1,
            text: 'Con ch??',
            isCorrect: true, 
          },
          {
            id: 2,
            text: 'Con m??o',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con c??',
            isCorrect: false, 
          },
          {
            id: 4,
            text: 'Con heo',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 2,
        question: 'Cat',
        answers: [
          {
            id: 1,
            text: 'Con v???t',
            isCorrect: false, 
          },
          {
            id: 2,
            text: 'Con heo',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con c?? m???p ',
            isCorrect: false, 
          },
          {
            id: 4,
            text: 'Con ca heo',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 3,
        question: 'Mouse',
        answers: [
          {
            id: 1,
            text: 'Con M??o',
            isCorrect: false, 
          },
          {
            id: 2,
            text: 'Con s?? t???',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con chu???t',
            isCorrect: true, 
          },
          {
            id: 4,
            text: 'Con h???',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 4,
        question: 'Lion',
        answers: [
          {
            id: 1,
            text: 'Con c?? ch??p',
            isCorrect: false, 
          },
          {
            id: 2,
            text: 'Con ch?? s??i',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con c???p',
            isCorrect: false, 
          },
          {
            id: 4,
            text: 'Con s?? t???',
            isCorrect: true, 
          }
        ]
      },
      {
        id: 5,
        question: 'Wolf',
        answers: [
          {
            id: 1,
            text: 'Con ch?? s??i',
            isCorrect: true, 
          },
          {
            id: 2,
            text: 'Con m??o',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con c??',
            isCorrect: false, 
          },
          {
            id: 4,
            text: 'Con heo',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 6,
        question: 'Shark',
        answers: [
          {
            id: 1,
            text: 'Kh???ng long',
            isCorrect: false, 
          },
          {
            id: 2,
            text: 'G???u b???c c???c',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'C?? m???p',
            isCorrect: true, 
          },
          {
            id: 4,
            text: 'Con voi',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 7,
        question: 'Bear',
        answers: [
          {
            id: 1,
            text: 'Con g???u',
            isCorrect: true, 
          },
          {
            id: 2,
            text: 'Con h???',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con ch???n',
            isCorrect: false, 
          },
          {
            id: 4,
            text: 'Con th???',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 8,
        question: 'Rabbit',
        answers: [
          {
            id: 1,
            text: 'Con ch??',
            isCorrect: false, 
          },
          {
            id: 2,
            text: 'Con m??o',
            isCorrect: false, 
          },
          {
            id: 3,
            text: 'Con th???',
            isCorrect: true, 
          },
          {
            id: 4,
            text: 'Con heo',
            isCorrect: false, 
          }
        ]
      },
      {
        id: 9,
        question: 'Duck',
        answers: [
          {
            id: 1,
            text: 'Con heo',
            isCorrect: true, 
          },
          {
            id: 2,
            text: 'Con b??',
            isCorrect: true, 
          },
          {
            id: 3,
            text: 'Con v???t',
            isCorrect: true, 
          },
          {
            id: 4,
            text: 'Con tr??u',
            isCorrect: true, 
          }
        ]
      },
      {
        id: 10,
        question: 'Cow',
        answers: [
          {
            id: 1,
            text: 'Con b??',
            isCorrect: true, 
          },
          {
            id: 2,
            text: 'Con v???t',
            isCorrect: true, 
          },
          {
            id: 3,
            text: 'Con c??',
            isCorrect: true, 
          },
          {
            id: 4,
            text: 'Con th???',
            isCorrect: true, 
          }
        ]
      },
  ]

  res.json({
    success: true,
    data: response
  })
}



exports.getTranslateExercise = (req, res) => {
  const response = [
      {
        id: 1,
        question: 'Xin ch??o',
        answer: 'H E L L O' ,
        random: 'E L O H L'
      },
      {
        id: 2,
        question: 'Con m??o',
        answer: 'C A T' ,
        random: 'A C T'
      },
      {
        id: 3,
        question: 'Con ch??',
        answer: 'D O G' ,
        random: 'G O D'
      },
      {
        id: 4,
        question: 'Con heo',
        answer: 'P I G' ,
        random: 'P G I'
      },
      {
        id: 5,
        question: 'Con chim',
        answer: 'B I R D' ,
        random: 'B I D I'
      },
      {
        id: 6,
        question: 'T???m bi???t',
        answer: 'G O O D B Y E' ,
        random: 'O O D G E Y B'
      },
      {
        id: 7,
        question: 'B??t ch??',
        answer: 'P E N C I L' ,
        random: 'P N E C L I'
      },
      {
        id: 8,
        question: 'Con b??',
        answer: 'C O W' ,
        random: 'C W O'
      },
      {
        id: 9,
        question: 'Con ki???n',
        answer: 'A N T' ,
        random: 'T A N'
      },
      {
        id: 10,
        question: 'S??ng',
        answer: 'G U N' ,
        random: 'G N U'
      }
  ]

  res.json({
    success: true,
    data: response
  })
}


exports.getMatchGameExercise = (req, res) => {
  const response = [
    {
      id: 1,
      text: 'Dog',
      matchId: 2,
    },
    {
      id: 2,
      text: 'Con ch??',
      matchId: 1,
    },
    {
      id: 3,
      text: 'Car',
      matchId: 4,
    },
    {
      id: 4,
      text: '?? t??',
      matchId: 3,
    },
    {
      id: 5,
      text: 'Cat',
      matchId: 6,
    },
    {
      id: 6,
      text: 'Con m??o',
      matchId: 5,
    },
    {
      id: 7,
      text: 'Chick ',
      matchId: 8,
    },
    {
      id: 8,
      text: 'Con g?? con',
      matchId: 7,
    }
  ]
  res.json({
    success: true,
    data: response
  })
}

