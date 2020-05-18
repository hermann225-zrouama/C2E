/*******************************
 *IMPORTATION DU PACKAGE MONGOOSE
 *******************************/
const mongoose = require("mongoose");

/**********************************************
 *CONNEXION A LA DB http://localhost:27017/HOSPI
 **********************************************/
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("err connection :" + JSON.stringify(err, undefined, 2));
    } else {
      console.log("MongoDb connection succeed");
    }
  }
);

