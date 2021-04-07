const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware function that extracts token from request header and checks if it is valid or not and passes it to the API calls
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'No token found, authorization denied.' }] });
  }
  try {
    const decoded = jwt.decode(token, config.get('loginToken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ errors: [{ msg: 'Token is not valid.' }] });
  }
};
