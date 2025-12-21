import Jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (id, role) => {
  const AccessToken = Jwt.sign(
    { _id: id, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const RefreshToken = Jwt.sign(
    { _id: id, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { AccessToken, RefreshToken };
};
