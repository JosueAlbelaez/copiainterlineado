import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'free' | 'premium' | 'admin';
  dailyPhrasesCount: number;
  lastPhrasesReset: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export { IUser };