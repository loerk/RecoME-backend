import jwt from "jsonwebtoken";
import config from "config";

export const generateToken = (payload) => {
  const ACCESS_SECRET = config.get("jwt_secret.access");
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "360000",
  });
};
