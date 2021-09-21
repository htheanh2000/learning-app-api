const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mongoose =  require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).json({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).json({ message: err });
              return;
            }
            res.json({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        console.log({ role });
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).json({ message: err });
            return;
          }
          res.json({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
exports.signin = (req, res) => {
  console.log('signin body', req.body);
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      console.log('after exec', err, user);
      if (err) {
        return res.status(500).json({ message: err });
      }
      if (!user) {
        return res.status(404).json({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).json({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      const category = await getUserCategoryById(user._id)
      return res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        category: category.reduce((a, v) => ({ ...a, [v.type]: v.count}), {}) 
      });
    });
};

const getUserCategoryById = async (id) => {
  console.log("id", id);
  if(!id) return []
  return await User.aggregate([
    { $match: { _id: ObjectId(id) } },
    { $project: { "is_deleted": 0, "__v": 0, "password": 0, "roles": 0 } },
    {
      $lookup:
      {
        from: "vocabularies",
        localField: "category",
        foreignField: "_id",
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
        _id: "$category.type",
        type: { $first: "$category.type" },
        count: { $sum: 1 }
      }
    }
  ])
    .then((category) => {
      return category
    })
    .catch((err) => {
      return []
    });
}