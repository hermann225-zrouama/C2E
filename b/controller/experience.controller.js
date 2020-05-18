const mongoose = require("mongoose");

require("../model/user.model");
var User = require("../model/user.model");
var Users = mongoose.model("User");

require("../model/experience.model");
var Exp = require("../model/experience.model");
var Exps = mongoose.model("Exp");

exports.save_experience = function (req, res, next) {
  var exp = new Exps({
    company: req.body.company,
    debut: req.body.debut,
    fin: req.body.fin,
    job: req.body.job,
    description: req.body.description,
    user: req.body.id,
  });

  exp.save(function (err) {
    if (err) {
      console.log(err);
      return res.send({ msg: err.message });
    }
    Exp.find({ user: req.body.id }).then((data) => {
      res.send({
        type: "success",
        msg: "experience mise a jour avec success",
        exp_data: data,
      });
    });
  });
};

exports.get_exp = function (req, res, next) {
  Exp.find({ user: req.body.id }).then((data) => {
    res.send({
      type: "success",
      msg: "experience mise a jour avec success",
      exp_data: data,
    });
  });
};
