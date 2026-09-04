import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await login(form.email, form.password);

      toast.success(`Welcome back, ${data.name}!`);

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md bg-white border border-line rounded-sm2 p-8 shadow-card animate-fade-in">

        {/* Heading */}
        <h1 className="text-3xl font-display font-semibold text-center mb-1">
          Welcome <span className="text-ember">back</span>
        </h1>

        <p className="text-center text-sm text-ink/50 mb-8">
          Sign in to continue ordering
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email address
            </label>

            <input
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Password
            </label>

            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-ink/60 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-ember font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;