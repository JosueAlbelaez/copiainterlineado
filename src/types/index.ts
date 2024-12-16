export interface Reading {
  _id: string;
  title: string;
  category: Category;
  english_text: string;
  spanish_translation: string;
  imageUrl: string;  // Nueva propiedad para la URL de la imagen
}

export type Category =
   'Conversations'
  | 'Technology'
  | 'Literature'
  | 'Work'
  | 'Studies'
    'Short Stories'
  | 'Home'
  | 'Travel'
  | 'Food'
  | 'Entertainment'
  | 'Health'
  | 'City'
  | 'Nature'
    'Irregular Verbs';