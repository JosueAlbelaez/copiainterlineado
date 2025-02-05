import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from './src/lib/models/User';
import { Phrase } from './src/lib/models/Phrase';
import { generateToken, verifyToken } from './src/lib/utils/jwt';
import { sendPasswordResetEmail } from './src/lib/utils/email';
import { startOfDay } from 'date-fns';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

// 1. Extender tipos de Express
declare global {
  namespace Express {
    interface Request {
      user?: mongoose.Document & InstanceType<typeof User>;
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
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// 6. Async handler con tipos seguros
const asyncHandler = <T = void>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 7. Middleware de autenticación corregido
const authenticateToken: express.RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
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

// 10. Rutas de autenticación
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
    return res.status(400).json({ error: validation.error.errors });
  }

  const { email, password } = validation.data;
  console.log('Buscando usuario:', email);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    console.log('Usuario no encontrado:', email); 
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  console.log('Login exitoso. Generando token...'); 
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

// 9. Rutas protegidas
app.get('/api/auth/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  res.json({
    id: req.user!._id,
    firstName: req.user!.firstName,
    lastName: req.user!.lastName,
    email: req.user!.email,
    role: req.user!.role
  });
}));

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
    ...(language && { language }),
    ...(category && { category }),
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

// 10. Manejo de errores mejorado
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error:', error.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// 11. Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// Webhook para recibir notificaciones de pago
app.post('/api/webhook', asyncHandler(async (req: Request, res: Response) => {
  const { type, data } = req.body;

  if (type === 'payment') {
    const paymentId = data.id;
    // Aquí implementaremos la lógica para actualizar el estado de la suscripción
    // basado en el estado del pago
  }

  res.sendStatus(200);
}));

// Configuración de Mercado Pago con el token de acceso desde variables de entorno
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

// Ruta para crear preferencia de pago
app.post('/api/create-preference', asyncHandler(async (req: Request, res: Response) => {
  const { planId, title, price, interval } = req.body;
  
  if (!planId || !title || !price) {
    console.error('Datos de plan incompletos:', { planId, title, price });
    return res.status(400).json({ error: 'Datos de plan incompletos' });
  }
  
  try {
    console.log('Creando preferencia con datos:', { planId, title, price, interval });
    
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: planId,
            title: title,
            quantity: 1,
            unit_price: Number(price),
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
          planId,
          interval
        }
      }
    });

    console.log('Preferencia creada exitosamente:', preference.id);
    res.json({ preferenceId: preference.id });
  } catch (error) {
    console.error('Error detallado al crear preferencia:', error);
    res.status(500).json({ 
      error: 'Error al crear preferencia de pago',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));
