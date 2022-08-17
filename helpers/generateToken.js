import jwt from "jsonwebtoken";
import config from "config";

export const generateToken = (payload, type) => {
  const REFRESH_SECRET = config.get("jwt_secret.refresh");
  const ACCESS_SECRET = config.get("jwt_secret.access");
  if (type === "ACCESS")
    return jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "3hr",
    });
  if (type === "REFRESH")
    return jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "5d",
    });
  if (type === "EMAIL")
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "360000" });
};
