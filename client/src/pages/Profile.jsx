import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile } from '../services/userService.js';

const emptyProfile = {
  name: '',
  headline: '',
  location: '',
  bio: '',
  skills: '',
};

export default function Profile() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState(emptyProfile);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        setForm({
          ...profile,
          skills: profile.skills?.join(', ') || '',
        });
      } catch {
        setMessage('Could not load your profile.');
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const skills = form.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      const savedProfile = await updateProfile({ ...form, skills });
      updateUser({ name: savedProfile.name });
      setMessage('Profile saved successfully.');
    } catch {
      setMessage('Could not save your profile.');
    }
  }

  return (
    <section className="card form-card">
      <span className="eyebrow">Your profile</span>
      <h1>Tell recruiters what you do best</h1>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Professional headline
          <input
            name="headline"
            value={form.headline || ''}
            onChange={handleChange}
            placeholder="Frontend Developer"
          />
        </label>

        <label>
          Location
          <input name="location" value={form.location || ''} onChange={handleChange} />
        </label>

        <label>
          Skills (comma separated)
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, PostgreSQL"
          />
        </label>

        <label className="full">
          About you
          <textarea name="bio" rows="6" value={form.bio || ''} onChange={handleChange} />
        </label>

        <button className="button" type="submit">Save profile</button>
      </form>

      {message && <p className="notice">{message}</p>}
    </section>
  );
}
