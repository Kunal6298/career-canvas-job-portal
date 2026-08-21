import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthForm } from './Login.jsx';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const user = await register(form);
      const dashboard = user.role === 'recruiter' ? '/recruiter' : '/seeker';
      navigate(dashboard);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create account.');
    }
  }

  return (
    <AuthForm
      title="Create your account"
      onSubmit={handleSubmit}
      error={error}
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <label>
        Name
        <input name="name" required value={form.name} onChange={handleChange} />
      </label>
      <label>
        Email
        <input name="email" type="email" required value={form.email} onChange={handleChange} />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          minLength="8"
          required
          value={form.password}
          onChange={handleChange}
        />
      </label>
      <label>
        I am a
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="seeker">Job seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </label>
    </AuthForm>
  );
}
