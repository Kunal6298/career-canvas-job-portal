import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthForm } from './Login.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    try { const user = await register(form); navigate(user.role === 'recruiter' ? '/recruiter' : '/seeker'); }
    catch (err) { setError(err.response?.data?.message || 'Unable to create account.'); }
  };
  return <AuthForm title="Create your account" submit={submit} error={error} footer={<>Already registered? <Link to="/login">Log in</Link></>}>
    <label>Name<input name="name" required value={form.name} onChange={change} /></label>
    <label>Email<input name="email" type="email" required value={form.email} onChange={change} /></label>
    <label>Password<input name="password" type="password" minLength="8" required value={form.password} onChange={change} /></label>
    <label>I am a<select name="role" value={form.role} onChange={change}><option value="seeker">Job seeker</option><option value="recruiter">Recruiter</option></select></label>
  </AuthForm>;
}
