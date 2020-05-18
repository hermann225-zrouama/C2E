const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**************************
 * USER DB MONGOOSE SCHEMA
 **************************/

var userschema = new mongoose.Schema({
  nom: {
    type: String,
    required: "le nom ne peut etre vide",
  },
  promotion: {
    type: String,
    required: "",
  },
  is_etudiant: {
    type: Boolean,
    default: true,
  },
  filiere: {
    type: String,
  },
  connected: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: "",
  },
  access_level: {
    type: String,
    default: "STUDENT",
  },
  email: {
    type: String,
    required: "le mail ne peut etre vide",
    unique: true,
  },
  last_connection: {
    type: String,
    default: Date(),
  },
  password: {
    type: String,
    required: "password ne peut pas etre vide",
  },
  telephone: {
    type: String,
    required: "le numero ne peut etre vide",
    default: "",
  },
  isVerified: { type: Boolean, default: false },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: "" },
  saltsecret: String,
});

userschema.pre("save", function (next) {
  this.saltsecret = bcrypt.genSaltSync(5);
  next();
});

/******************************
 * CREATION DU MODEL DE DONNÉES
 *****************************/
module.exports = User = mongoose.model("User", userschema);
