require("./config/config");
require("./model/db");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

/*var redis = require("redis");
var session = require("express-session");
*/
var app = express();

//var RedisStore = require("connect-redis")(session);
// en mode dev local
/*var client_dev = redis.createClient();
var redis_client_dev = new RedisStore({ client: client_dev });
*/
// en mode prod
/*
var client_prod = redis.createClient({
  port: 18149,
  host: "ec2-3-232-159-117.compute-1.amazonaws.com",
  password: "pdf95cabee24609475e7a93d8b183084dc81cc1c13d1b06eb86127d360ad08ad8",
});
var redis_client_prod = new RedisStore({ client: client_prod });
app.use(
  session({
    store: redis_client_prod,
    secret: "X-COMMUNITY",
    saveUninitialized: false,
    resave: true,
  })
);*/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/file", express.static("upload"));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
