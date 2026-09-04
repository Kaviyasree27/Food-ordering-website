import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password confirmation
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }

    // Check minimum password length
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Register customer
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      toast.success(`Welcome to TasteHub, ${data.name}!`);

      // Go to customer home page
      navigate('/');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md bg-white border border-line rounded-sm2 p-8 shadow-card animate-fade-in">

        {/* Heading */}
        <h1 className="text-3xl font-display font-semibold text-center mb-1">
          Create an <span className="text-ember">account</span>
        </h1>

        <p className="text-center text-sm text-ink/50 mb-8">
          Join TasteHub and start ordering
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full name
            </label>

            <input
              type="text"
              name="name"
              required
              maxLength={50}
              className="input-field"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email address
            </label>

            <input
              type="email"
              name="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Phone number
            </label>

            <input
              type="tel"
              name="phone"
              className="input-field"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Password + Confirm Password */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Confirm
              </label>

              <input
                type="password"
                name="confirm"
                required
                minLength={6}
                className="input-field"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}

          <Link
            to="/login"
            className="text-ember font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;