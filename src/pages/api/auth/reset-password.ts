import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/utils/jwt';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token y contraseña son requeridos' });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}