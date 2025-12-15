import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Cookie settings for cross-origin (production) and local development
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS required)
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};
