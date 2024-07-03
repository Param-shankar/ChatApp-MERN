const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authuser = (uid) => {
  const verified = jwt.verify(uid, process.env.JWT_Seret);
  console.log(verified);
  return verified;
};

module.exports = authuser;
