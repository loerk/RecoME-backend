import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (payload, type) => {
  const REFRESH_SECRET = process.env.REACT_APP_REFRESH_SECRET;
  const ACCESS_SECRET = process.env.REACT_APP_ACCESS_SECRET;

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
