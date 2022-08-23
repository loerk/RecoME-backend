import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyAccessToken = (req, res, next) => {
  const ACCESS_SECRET = process.env.REACT_APP_ACCESS_SECRET;
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return res.status(401).json({ message: "Forbidden" });

  jwt.verify(accessToken, ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default verifyAccessToken;
