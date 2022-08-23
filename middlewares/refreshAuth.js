const jwt = require("jsonwebtoken");
import "dotenv/config";

export const refreshAuth = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.REACT_APP_REFRESH_SECRET,
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    }
  );
};
