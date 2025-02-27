import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../src/lib/models/User';
import { Phrase } from '../src/lib/models/Phrase';
import { Reading } from '../src/lib/models/Reading';
import { generateToken, verifyToken } from '../src/lib/utils/jwt';
import { sendPasswordResetEmail } from '../src/lib/utils/email';
import { startOfDay } from 'date-fns';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import IUser from '../src/types/express';

dotenv.config();

// Define the IUser interface for type safety
interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'free' | 'premium' | 'admin';
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  dailyPhrasesCount: number;
  lastPhrasesReset: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Update Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// 2. Esquemas de validación con Zod
const SignUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// 3. Configuración inicial
const app: Express = express();
const PORT = process.env.PORT || 5001;
const FREE_CATEGORIES = ['Greeting and Introducing', 'Health and Wellness'];

// 4. Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// 5. Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://fluentphrases.org',
    'https://interlineado-backend-fluent-phrases.vercel.app',
    'https://backend-interlineado.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ message: 'Backend is working!' });
});

// 6. Async handler con tipos seguros
const asyncHandler = <T = void>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 7. Middleware de autenticación corregido
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decoded.userId).exec() as IUser;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Ruta para solicitar recuperación de contraseña
app.post('/api/auth/forgot-password', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'No existe una cuenta con este correo electrónico' });
  }

  const resetToken = generateToken({ userId: user._id }, '30m');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
  await user.save();

  try {
    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
  }
}));

// Rutas de autenticación
app.post('/api/auth/signup', asyncHandler(async (req: Request, res: Response) => {
  const validation = SignUpSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  const { firstName, lastName, email, password } = validation.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = new User({ firstName, lastName, email, password });
  await user.save();

  const token = generateToken({ userId: user._id });
  
  res.status(201).json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
}));

app.post('/api/auth/signin', asyncHandler(async (req: Request, res: Response) => {
  const validation = SignInSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ 
      error: validation.error.errors.map(e => e.message).join(', ')
    });
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generateToken({ userId: user._id });
  
  res.json({
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  });
}));

// Rutas protegidas
app.get('/api/auth/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  res.json({
    id: req.user!._id,
    firstName: req.user!.firstName,
    lastName: req.user!.lastName,
    email: req.user!.email,
    role: req.user!.role
  });
}));

// Ruta para obtener lecturas
app.get('/api/readings', authenticateToken, asyncHandler(async (_req: Request, res: Response) => {
  try {
    const readings = await Reading.find();
    res.json(readings);
  } catch (error) {
    console.error('Error al obtener lecturas:', error);
    res.status(500).json({ error: 'Error al obtener lecturas' });
  }
}));

// Ruta para obtener frases
app.get('/api/phrases', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { language, category } = req.query;
  const user = req.user!;

  if (user.role === 'free') {
    const today = startOfDay(new Date());
    const lastReset = startOfDay(user.lastPhrasesReset);

    if (today > lastReset) {
      user.dailyPhrasesCount = 0;
      user.lastPhrasesReset = new Date();
      await user.save();
    }
  }

  const query: any = { 
    ...(language && { language: language.toString() }),
    ...(category && { category: category.toString() }),
    ...(user.role === 'free' && { category: { $in: FREE_CATEGORIES } })
  };

  const phrases = await Phrase.find(query);
  
  res.json({
    phrases,
    userInfo: {
      role: user.role,
      dailyPhrasesCount: user.dailyPhrasesCount
    }
  });
}));

// Ruta para incrementar el contador de frases
app.post('/api/phrases/increment', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  if (user.role === 'free') {
    user.dailyPhrasesCount += 1;
    await user.save();
  }
  res.json({ dailyPhrasesCount: user.dailyPhrasesCount });
}));

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

// Ruta para crear preferencia de pago
app.post('/api/payments/create-preference', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { plan } = req.body;
  
  try {
    const planConfig = {
      monthly: { price: 9.99, title: "Plan Mensual" },
      biannual: { price: 49.99, title: "Plan Semestral" },
      annual: { price: 89.99, title: "Plan Anual" }
    };

    const selectedPlan = planConfig[plan as keyof typeof planConfig];
    if (!selectedPlan) {
      return res.status(400).json({ error: 'Plan inválido' });
    }

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: plan,
            title: selectedPlan.title,
            quantity: 1,
            unit_price: selectedPlan.price,
            currency_id: "USD"
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failure`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`
        },
        auto_return: "approved",
        notification_url: `${process.env.BACKEND_URL}/api/webhook`,
        metadata: {
          userId: req.user!._id,
          planId: plan
        }
      }
    });

    res.json({ preferenceId: preference.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
}));

// Webhook para recibir notificaciones de pago
app.post('/api/webhook', asyncHandler(async (req: Request, res: Response) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    try {
      const { metadata } = data;
      if (metadata?.userId) {
        await User.findByIdAndUpdate(metadata.userId, {
          role: 'premium'
        });
        console.log(`Usuario ${metadata.userId} actualizado a premium`);
      }
    } catch (error) {
      console.error('Error procesando webhook:', error);
    }
  }

  res.sendStatus(200);
}));

// Manejo de errores mejorado
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Error:', error.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

export default app;