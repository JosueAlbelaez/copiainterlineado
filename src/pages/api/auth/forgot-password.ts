import { connectDB } from '@/lib/config/db';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { sendPasswordResetEmail } from '@/lib/utils/email';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = generateToken({ userId: user._id }, '1h');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}