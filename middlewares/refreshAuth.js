import config from "config";
const jwt = require("jsonwebtoken");

export const refreshAuth = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, config.get("jwt_secret.refresh"), (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
