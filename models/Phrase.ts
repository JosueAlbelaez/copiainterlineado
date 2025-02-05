import mongoose, { Document } from 'mongoose';

export interface IPhrase extends Document {
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
  isFree: boolean;
}

const phraseSchema = new mongoose.Schema<IPhrase>({
  targetText: {
    type: String,
    required: true,
    trim: true
  },
  translatedText: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['English', 'Portuguese']
  },
  isFree: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

phraseSchema.index({ language: 1, category: 1, isFree: 1 });

export const Phrase = mongoose.models.Phrase || mongoose.model<IPhrase>('Phrase', phraseSchema);