import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = () => {
    login({ username: 'user', password: '1234' });
  };

  return <button onClick={handleLogin}>Iniciar sesión</button>;
}