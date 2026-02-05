import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthForm = ({ mode }) => {
  const isRegister = mode === 'register';
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };
      await authenticate(isRegister ? 'register' : 'login', payload);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">{isRegister ? 'Create account' : 'Login'}</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        {isRegister && (
          <input
            className="w-full rounded border p-2"
            placeholder="Name"
            name="name"
            required
            onChange={onChange}
          />
        )}
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          name="email"
          type="email"
          required
          onChange={onChange}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          name="password"
          type="password"
          required
          minLength={6}
          onChange={onChange}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-600 p-2 font-semibold text-white" type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link className="text-blue-600" to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </div>
  );
};
