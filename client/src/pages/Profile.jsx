import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile } from '../services/userService.js';

export default function Profile() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', headline: '', location: '', bio: '', skills: '' });
  const [message, setMessage] = useState('');
  useEffect(() => { getProfile().then((data) => setForm({ ...data, skills: data.skills?.join(', ') || '' })); }, []);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    try {
      const profile = await updateProfile({ ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
      updateUser({ name: profile.name });
      setMessage('Profile saved successfully.');
    } catch { setMessage('Could not save your profile.'); }
  };
  return <section className="card form-card"><span className="eyebrow">Your profile</span><h1>Tell recruiters what you do best</h1><form className="form-grid" onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={change} required /></label><label>Professional headline<input name="headline" value={form.headline || ''} onChange={change} placeholder="Frontend Developer" /></label><label>Location<input name="location" value={form.location || ''} onChange={change} /></label><label>Skills (comma separated)<input name="skills" value={form.skills} onChange={change} placeholder="React, JavaScript, PostgreSQL" /></label><label className="full">About you<textarea name="bio" rows="6" value={form.bio || ''} onChange={change} /></label><button className="button" type="submit">Save profile</button></form>{message && <p className="notice">{message}</p>}</section>;
}
