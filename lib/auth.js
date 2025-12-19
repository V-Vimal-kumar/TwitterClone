import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = (password) =>
  bcrypt.hash(password, 10);

export const comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
