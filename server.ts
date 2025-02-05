import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { User } from './models/User';
import { Phrase } from './models/Phrase';
import { verifyToken } from './utils/jwt';
import { startOfDay } from 'date-fns';

config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Helper para manejar async/await
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware para verificar el token
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
};

// Rutas protegidas
app.get('/api/phrases', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { language, category } = req.query;
  const user = req.user!;

  console.log('👤 Usuario:', { id: user._id, role: user.role });
  console.log('🔍 Buscando frases con:', { language, category });
  
  let query: any = {};
  
  if (language) {
    query.language = language;
  }
  
  if (category && category !== 'all') {
    query.category = category;
  }

  // Resetear el contador diario si es necesario
  if (user.role === 'free') {
    const today = startOfDay(new Date());
    const lastReset = startOfDay(user.lastPhrasesReset);

    if (today > lastReset) {
      user.dailyPhrasesCount = 0;
      user.lastPhrasesReset = new Date();
      await user.save();
      console.log('🔄 Contador diario reseteado para usuario:', user._id);
    }

    // Para usuarios free, solo mostrar categorías gratuitas si se especifica una categoría
    if (category && category !== 'all') {
      const FREE_CATEGORIES = ['Conversations', 'Technology'];
      if (!FREE_CATEGORIES.includes(category as string)) {
        return res.status(403).json({ 
          error: 'Categoría no disponible para usuarios gratuitos',
          userInfo: {
            role: user.role,
            dailyPhrasesCount: user.dailyPhrasesCount
          }
        });
      }
    }
  }

  console.log('📝 Query final:', query);
  const phrases = await Phrase.find(query);
  console.log(`✨ Encontradas ${phrases.length} frases`);
  
  res.json({
    phrases,
    userInfo: {
      role: user.role,
      dailyPhrasesCount: user.dailyPhrasesCount
    }
  });
}));

// Ruta para incrementar el contador diario
app.post('/api/phrases/increment', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  if (user.role === 'free') {
    const today = startOfDay(new Date());
    const lastReset = startOfDay(user.lastPhrasesReset);

    if (today > lastReset) {
      user.dailyPhrasesCount = 1;
      user.lastPhrasesReset = new Date();
    } else {
      user.dailyPhrasesCount += 1;
    }

    await user.save();
  }

  res.json({ dailyPhrasesCount: user.dailyPhrasesCount });
}));

// Ruta para obtener información del usuario
app.get('/api/user/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    dailyPhrasesCount: user.dailyPhrasesCount
  });
}));

// Ruta para iniciar sesión
app.post('/api/auth/signin', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = verifyToken(JSON.stringify({ userId: user._id }));
  res.json({ token, user });
}));

// Ruta para registro
app.post('/api/auth/signup', asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    role: 'free',
    dailyPhrasesCount: 0,
    lastPhrasesReset: new Date()
  });

  await user.save();
  const token = verifyToken(JSON.stringify({ userId: user._id }));
  res.status(201).json({ token, user });
}));

// Manejador de errores global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
