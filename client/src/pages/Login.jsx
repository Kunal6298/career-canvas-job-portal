import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) { setError(err.response?.data?.message || 'Unable to log in.'); }
  };

  return <AuthForm title="Welcome back" submit={submit} error={error} footer={<>New here? <Link to="/register">Create an account</Link></>}>
    <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
    <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
  </AuthForm>;
}

export function AuthForm({ title, submit, error, footer, children }) {
  return <section className="auth-card card"><span className="eyebrow">Job Portal</span><h1>{title}</h1><form onSubmit={submit}>{children}<button className="button" type="submit">Continue</button></form>{error && <p className="error">{error}</p>}<p>{footer}</p></section>;
}
