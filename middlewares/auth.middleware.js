const sign = require("jwt-encode");
const unsign = require("jwt-decode");
const SECRET = process.env.USER_PWD_SECRET;
const authVerify = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decodedToken = unsign(token, SECRET);
    req.user = { userId: decodedToken[0]._id };
    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorised access, please add the token",
      errorMessage: err.message,
    });
  }
};

module.exports = { authVerify };
