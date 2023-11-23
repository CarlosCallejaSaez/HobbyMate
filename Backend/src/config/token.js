const jwt = require("jsonwebtoken");


const generateToken = (id, email) => {
  if (!id || !email) {
    throw new Error("There is not emial or id");
  }

  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("There is not token");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };