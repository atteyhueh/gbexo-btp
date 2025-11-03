import jwt from 'jsonwebtoken';

export const generateToken = (id: string, email: string) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};
