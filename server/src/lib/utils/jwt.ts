import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (payload: object, expiresIn: string = '7d'): string => {
  const options: SignOptions = {
    expiresIn
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): CustomJwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
  return decoded;
};