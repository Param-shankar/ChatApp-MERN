const express = require("express");

const router = express.Router();

router.route("/api/logout").post((req, res) => {
  // console.log(res.body);
  res.clearCookie("uid");
  console.log("cokie has been cleared ")
});

module.exports = router;
