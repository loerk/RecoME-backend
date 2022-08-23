import jwt from "jsonwebtoken";
import "dotenv/config";

export const isEmailTokenValid = (emailToken) => {
  const ACCESS_SECRET = process.env.REACT_APP_ACCESS_SECRET;
  if (!emailToken) return false;

  return jwt.verify(emailToken, ACCESS_SECRET);
};
