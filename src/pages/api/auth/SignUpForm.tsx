import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { emailValidator, passwordValidator } from '@/lib/validators';
import axios from 'axios';

interface SignUpFormProps {
  onAuthSuccess: () => void;
}

export function SignUpForm({ onAuthSuccess }: SignUpFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre es requerido",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: "Error de validación",
        description: "El apellido es requerido",
        variant: "destructive"
      });
      return false;
    }

    if (!emailValidator(formData.email)) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive"
      });
      return false;
    }

    if (!passwordValidator(formData.password)) {
      toast({
        title: "Error de validación",
        description: "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/signup', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast({
        title: "Registro exitoso",
        description: "¡Tu cuenta ha sido creada exitosamente!",
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onAuthSuccess();

    } catch (error: any) {
      if (error.response?.status === 409) {
        toast({
          title: "Error de registro",
          description: "Este correo electrónico ya está registrado",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Ha ocurrido un error durante el registro. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-sm text-gray-500">
              La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}