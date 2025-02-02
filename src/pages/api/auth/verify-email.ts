import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/utils/jwt';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { token } = req.body;
    const decoded = verifyToken(token);

    if (!decoded || !decoded.email) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verificado exitosamente' });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}