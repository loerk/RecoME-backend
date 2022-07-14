import config from "config";
import jwt from "jsonwebtoken";

export const isEmailTokenValid = (emailToken) => {
  const ACCESS_SECRET = config.get("jwt_secret.access");
  if (!emailToken) return false;

  return jwt.verify(emailToken, ACCESS_SECRET);
};
