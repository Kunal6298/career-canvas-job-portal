import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in.');
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      onSubmit={handleSubmit}
      error={error}
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <label>
        Email
        <input name="email" type="email" required value={form.email} onChange={handleChange} />
      </label>
      <label>
        Password
        <input name="password" type="password" required value={form.password} onChange={handleChange} />
      </label>
    </AuthForm>
  );
}

export function AuthForm({ title, onSubmit, error, footer, children }) {
  return (
    <section className="auth-card card">
      <span className="eyebrow">CandidArc</span>
      <h1>{title}</h1>
      <form onSubmit={onSubmit}>
        {children}
        <button className="button" type="submit">Continue</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>{footer}</p>
    </section>
  );
}
