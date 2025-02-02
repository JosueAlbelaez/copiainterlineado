import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { sendVerificationEmail } from '@/lib/utils/email';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { firstName, lastName, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear token de verificación
    const verificationToken = generateToken({ email }, '24h');

    // Crear nuevo usuario
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      verificationToken
    });

    await user.save();

    // Enviar correo de verificación
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}