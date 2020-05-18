var express = require("express");
var router = express.Router();
var userController = require("../controller/user.controller");
var experienceController = require("../controller/experience.controller");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/user");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "It-space backend" });
});

////////////////////////////////////USER

router.get("/login", function (req, res, next) {
  res.redirect("http://localhost:5000");
});

router.post("/api/auth", function (req, res, next) {
  userController.loginPost(req, res, next);
});

router.post("/api/register", function (req, res, next) {
  console.log(req.body.data);
  userController.signupPost(req, res, next);
});

router.get("/api/logout/:id", function (req, res, next) {
  userController.logout(req, res, next);
});

router.get("/api/forgot/:mail", function (req, res, next) {
  userController.forgot(req, res, next);
});

router.post("/api/reset/", function (req, res, next) {
  userController.reset(req, res, next);
});

router.post("/api/update", function (req, res, next) {
  userController.update_u_info(req, res, next);
});

router.post("/api/upload_profile_photo/:id", upload.single("file"), function (
  req,
  res,
  next
) {
  userController.store_photo_profile(req, res, next);
});

router.post("/api/search", function (req, res, next) {
  userController.search(req, res, next);
});

router.get("/api/get_u_data/:id", function (req, res, next) {
  userController.get_u_data(req, res, next);
});

router.get("/api/confirmation/:token", userController.confirmationPost);

router.get("/api/fetch_all_user", function (req, res, next) {
  userController.fetch_all_user(req, res, next);
});

router.post("/api/drop_user", function (req, res, next) {
  userController.drop_user(req, res, next);
});

router.post("/api/nommer_user", function (req, res, next) {
  userController.nommer_user(req, res, next);
});

router.post("/api/denommer_user", function (req, res, next) {
  userController.denommer_user(req, res, next);
});

////////////////////////////////////////////////////EXPERIENCE

router.post("/api/save_experience", function (req, res, next) {
  experienceController.save_experience(req, res, next);
});

router.post("/api/get_experience", function (req, res, next) {
  experienceController.get_exp(req, res, next);
});

module.exports = router;
