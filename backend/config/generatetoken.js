const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const generatetoken = (id) => {
    const token = jwt.sign({id}, process.env.JWT_Seret, {
      expiresIn: "1d",
    });
    console.log("the token is :", token);
    return token
}   

module.exports = generatetoken