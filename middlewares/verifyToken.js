import jwt from "jsonwebtoken";
import config from "config";

export const verifyToken = (req, res, next) => {
  const ACCESS_SECRET = config.get("jwt_secret.access");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Forbidden" });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
