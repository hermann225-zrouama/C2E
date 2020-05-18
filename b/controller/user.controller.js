var crypto = require("crypto");
var nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

/*importation de la collection dans MongoDb*/
require("../model/user.model");
require("../model/token.model");

/*importattion du model User*/

var Token = require("../model/token.model");
var User = require("../model/user.model");

var Users = mongoose.model("User");
var Tokens = mongoose.model("Token");

var Mail;
var Tok;

/**
 * POST /signup
 */
exports.signupPost = function (req, res, next) {
  // verification de la présence d'erreur
  var errors = req.validationErrors;
  if (errors) {
    console.log(errors);
    return res.send({
      error: errors,
    });
  }
  // se rassurer que le compte n'existe pas deja
  User.findOne(
    {
      email: req.body.email
        .replace(/^[\s]/, "")
        .replace(/[\s]$/, "")
        .replace(/[\s]{2,}/g, " "),
    },
    function (err, user) {
      // se rassurer que personne ne possède cette email
      if (user)
        return res.send({
          msg: "le mail entré est déja associé a un autre compte",
          type: "error",
        });
      // creer et enregistrer le nouvel utilisateur
      user = new Users({
        nom: req.body.nom,
        email: req.body.email
          .replace(/^[\s]/, "")
          .replace(/[\s]$/, "")
          .replace(/[\s]{2,}/g, " "),
        promotion: req.body.promotion,
        password: bcrypt.hashSync(req.body.password, 10),
        is_etudiant: req.body.is_etudiant,
        filiere: req.body.filiere,
        telephone: req.body.telephone,
      });
      Mail = req.body.email;
      user.save(function (err) {
        if (err) {
          console.log(errors);
          return res.send({ msg: err.message });
        }
        // Creer un token de verification pour ce utilisateur
        var token = new Tokens({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        // Enregistrer le token
        token.save(function (err) {
          if (err) {
            return res.send({
              msg: err.message,
            });
          }
          // Envoyer le mail

          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "debah2002@gmail.com", pass: "hermann2002" },
          });

          var mailOptions = {
            from: "debah2002@gmail.com",
            to: user.email,
            subject: "Account Verification Token",
            text:
              "Hello,\n\n" +
              "Please verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/api/confirmation/" +
              token.token +
              ".\n il est valable que pour 30mins",
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.send({ msg: err.message });
            }
            res.status(200).send({
              msg: "A verification email has been sent to " + user.email + ".",
              type: "success",
            });
          });
        });
      });
    }
  );
};

/*
 * POST /confirmation
 */
exports.confirmationPost = function (req, res, next) {
  // Verifier la présence d'erreur
  var errors = req.validationErrors;
  if (errors) return res.status(400).send(errors);

  // Chercher un token correspondant
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg: "Votre token de confirmation doit avoir expiré.",
      });
    // Si je trouve je cherche l'utilisateur associé
    User.findOne(
      {
        _id: token._userId,
        email: Mail.replace(/[\s]$/, "").replace(/^[\s]/, ""),
      },
      function (err, user) {
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.isVerified)
          return res.status(400).send({
            type: "already-verified",
            msg: "Compte déja vérifié.",
          });

        // Je verifie confirme l'inscription de l'utilisateur et l'enregistre
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.send({ msg: err.message });
          }
          res.status(200).send("Compte verifié  veuillez vous connecter");
        });
      }
    );
  });
};

/**
 * POST /resend
 */
exports.resendTokenPost = function (req, res, next) {
  // Verifier la presence d'erreur
  var errors = req.validationErrors;
  if (errors) return res.status(400).send(errors);
  console.log(Mail);
  User.findOne(
    { email: Mail.replace(/[\s]$/, "").replace(/^[\s]/, "") },
    function (err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user with that email." });
      if (user.isVerified)
        return res.status(400).send({
          msg:
            'This account has already been verified. Please log in. <a href="/login">verification</a>',
        });

      // Creer un token de verification pour l'user
      var token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });

      // Enregistrement du token
      token.save(function (err) {
        if (err) {
          return res.send({ msg: err.message });
        }

        // envoi du mail
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: "debah2002@gmail.com", pass: "hermann2002" },
        });
        var mailOptions = {
          from: "debah2002@gmail.com",
          to: user.email,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/confirmation/" +
            token.token +
            ".\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.send({ msg: err.message });
          }
          res
            .status(200)
            .send("un mail de verification a été envoyé a " + user.email);
        });
      });
    }
  );
};

/*
 * POST /login
 */
exports.loginPost = function (req, res, next) {
  // Verification de la presence d'erreur
  var errors = req.validationErrors;
  if (errors) return res.send(errors);
  Mail = req.body.email;
  User.findOne(
    {
      email: req.body.email
        .replace(/^[\s]/, "")
        .replace(/[\s]$/, "")
        .replace(/[\s]{2,}/g, " "),
    },
    function (err, user) {
      if (!user)
        return res.send({
          type: "error",
          msg:
            "L'addresse mail " +
            req.body.email +
            " n'est associée a aucun compte",
        });
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // Se rassurer que son inscription a été confirmée
        if (!user.isVerified)
          return res.send({
            type: "error",
            msg:
              'utilisateur non verirfié. faites un tour dans votre boite mail</a>',
          });
        Mail = user.email;
        User.findByIdAndUpdate(
          { _id: user._id },
          {
            last_connection: req.body.last_connection,
            connected: true,
          },
          { useFindAndModify: false }
        )
          .then((data) => {
            if (!data) {
              res.status(404).send({
                type: "error",
                message: `error on update last_connection user._id : ${user._id}`,
              });
            } else {
              res.send({
                type: "success",
                user_data: user,
              });
            }
          })
          .catch((err) => {
            res.send({
              type: "error",
              msg: err,
            });
          });
      } else {
        return res.send({
          type: "error4",
          msg: "Verifier vos identifiants !",
        });
      }
    }
  );
};

exports.get_u_data = function (req, res, next) {
  if (req.params.id) {
    Users.findById(req.params.id).then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found User with id " + req.params.id });
      else res.send({ user_data: data });
    });
  }
};

exports.logout = function (req, res, next) {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { connected: false },
    { useFindAndModify: false }
  ).then(function () {
    res.status(200).send({
      msg: "logout",
    });
  });
};

exports.forgot = function (req, res, next) {
  Users.findOne(
    {
      email: req.params.mail
        .replace(/[\s]$/, "")
        .replace(/^[\s]/, "")
        .replace(/[\s]{2,}/g, ""),
    },
    function (err, user) {
      if (!user) {
        res.send({
          type: "error",
          msg: "l'email n'est associée a aucun compte",
        });
      } else {
        var token = crypto.randomBytes(16).toString("hex");
        // Enregistrer le token

        // Envoyer le mail
        Tok = token;

        User.findByIdAndUpdate(
          { _id: user._id },
          { passwordResetToken: token, passwordResetExpires: Date.now() + 600 },
          { useFindAndModify: false }
        ).then(function () {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "debah2002@gmail.com", pass: "hermann2002" },
          });

          var mailOptions = {
            from: "debah2002@gmail.com",
            to: user.email,
            subject: "pasword reset",
            text:
              "Hello,\n\n" +
              "voici le lien de reinitialisation de votre mot de passe: \nhttp://c2e-front.herokuapp.com/#/reset/" +
              token +
              ".\n il est valable que pour 10mins",
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.send({ msg: err.message });
            }
            res.status(200).send({
              msg:
                "des indications ont été envoyées sur l'addresse " +
                user.email +
                ".",
              type: "success",
            });
          });
        });
      }
    }
  );
};

exports.reset = function (req, res, next) {
  Users.findOne(
    {
      passwordResetToken: Tok,
    },
    function (err, user) {
      if (!user) {
        res.send({
          type: "error",
          msg: "votre token a du expiré",
        });
      } else {
        user.password = bcrypt.hashSync(req.body.password, 10);
        user.passwordResetToken = "";
        user.passwordResetExpires = "";
        user.save(function (err) {
          if (err) {
            console.log(errors);
            return res.send({ type: "error", msg: err.message });
          } else {
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: { user: "debah2002@gmail.com", pass: "hermann2002" },
            });

            var mailOptions = {
              from: "debah2002@gmail.com",
              to: user.email,
              subject: "pasword reset",
              text:
                "Hello,\n\n" +
                "Votre mot de passe a été réinitialisé avec succèss",
            };
            transporter.sendMail(mailOptions, function (err) {
              if (err) {
                return res.send({ msg: err.message });
              }
              res.status(200).send({
                msg: "Mot de passe reinitialisé avec succèss",
                type: "success",
              });
            });
          }
        });
      }
    }
  );
};

exports.update_u_info = function (req, res, next) {
  Users.findOne({ _id: req.body.id }, function (err, user) {
    user.nom = req.body.nom;
    user.promotion = req.body.promotion;
    user.filiere = req.body.filiere;
    user.is_etudiant = req.body.is_etudiant;
    user.telephone = req.body.telephone;

    user.save(function (err, product) {
      if (err) {
        console.log(errors);
        return res.send({ type: "error", msg: err.message });
      } else {
        Users.findOne({ _id: req.body.id }, function (err, user) {
          res.send({
            type: "success",
            msg: "vos informations ont bien étés mises a jour",
            user_data: user,
          });
        });
      }
    });
  });
};

exports.store_photo_profile = function (req, res, next) {
  console.log(req.file);
  var fullpath =
    req.protocol +
    "://" +
    req.headers.host +
    "/file/user/" +
    req.file.originalname;
  console.log(req.params.id);
  Users.findByIdAndUpdate(
    { _id: req.params.id },
    { photo: fullpath },
    { useFindAndModify: false }
  ).then(function () {
    Users.findOne({ _id: req.params.id }, function (err, user) {
      res.send({
        type: "success",
        msg: "photo mise a jour avec success",
        user_data: user,
      });
    });
  });
};

exports.search = function (req, res, next) {
  User.find({
    nom: { $regex: new RegExp(req.body.query), $options: "i" },
  }).then((data) => {
    res.send(data);
  });
};

exports.fetch_all_user = function (req, res, next) {
  User.find({}).then((data) => {
    res.send({
      user_data: data,
    });
  });
};

exports.drop_user = function (req, res, next) {
  User.findByIdAndDelete({ _id: req.body.id }).then(function (err, data) {
    res.send(data);
  });
};

exports.nommer_user = function (req, res, next) {
  User.findByIdAndUpdate(
    { _id: req.body.id },
    { access_level: "ADMIN" },
    { useFindAndModify: false }
  ).then(function (err, data) {
    res.send(data);
  });
};

exports.denommer_user = function (req, res, next) {
  User.findByIdAndUpdate(
    { _id: req.body.id },
    { access_level: "STUDENT" },
    { useFindAndModify: false }
  ).then(function (err, data) {
    res.send(data);
  });
};
