import { Document } from 'mongoose';

interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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

export {};