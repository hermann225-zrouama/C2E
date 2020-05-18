const mongoose = require("mongoose");

/**************************
 * USER DB MONGOOSE SCHEMA
 **************************/

var exp_schema = new mongoose.Schema({
  company: {
    type: String,
  },
  debut: {
    type: String,
  },
  fin: {
    type: String,
  },
  job: {
    type: String,
  },
  description: {
    type: String,
  },
  user: {
    type: String,
  },
});

/******************************
 * CREATION DU MODEL DE DONNÉES
 *****************************/
module.exports = Exp = mongoose.model("Exp", exp_schema);
