import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { User } from './src/models/User';
import { Phrase } from './src/models/Phrase';
import { verifyToken } from './src/utils/jwt';
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
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Rutas protegidas
app.get('/api/phrases', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { language, category } = req.query;
  const user = req.user!;

  try {
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

      // Para usuarios free, solo mostrar categorías gratuitas
      const FREE_CATEGORIES = ['Conversations', 'Technology'];
      query.category = { $in: FREE_CATEGORIES };
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
  } catch (error) {
    console.error('❌ Error al buscar frases:', error);
    res.status(500).json({ error: 'Error al buscar frases' });
  }
}));

// Ruta para incrementar el contador diario
app.post('/api/phrases/increment', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;

  try {
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
  } catch (error) {
    console.error('Error al incrementar contador:', error);
    res.status(500).json({ error: 'Error al incrementar contador' });
  }
}));

// Manejador de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
