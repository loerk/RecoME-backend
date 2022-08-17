import jwt from "jsonwebtoken";
import config from "config";

const verifyAccessToken = (req, res, next) => {
  const ACCESS_SECRET = config.get("jwt_secret.access");
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json({ message: "Forbidden" });

  jwt.verify(accessToken, ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default verifyAccessToken;
