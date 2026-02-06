import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const isRegister = mode === 'register';
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };
      await authenticate(isRegister ? 'register' : 'login', payload);
      navigate('/dashboard');
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              {isRegister ? (
                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {isRegister ? 'Sign up to get started' : 'Sign in to your account'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {isRegister && (
              <Input
                label="Name"
                placeholder="Enter your name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            )}
            <Input
              label="Email"
              placeholder="Enter your email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              to={isRegister ? '/login' : '/register'}
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
