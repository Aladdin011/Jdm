import jwt from "jsonwebtoken";

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET as string;
  const expires = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn: expires as jwt.SignOptions['expiresIn'] });
};
