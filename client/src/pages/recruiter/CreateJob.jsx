import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/jobService.js';

const initialForm = {
  title: '',
  companyName: '',
  location: '',
  employmentType: 'Full-time',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
  skills: '',
};

export default function CreateJob() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const skills = form.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      const newJob = await createJob({ ...form, skills });
      navigate(`/jobs/${newJob.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create job.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card form-card">
      <span className="eyebrow">Recruiter</span>
      <h1>Post a new job</h1>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Job title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Company name
          <input name="companyName" value={form.companyName} onChange={handleChange} required />
        </label>

        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>

        <label>
          Employment type
          <select name="employmentType" value={form.employmentType} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </label>

        <label>
          Minimum salary
          <input type="number" min="0" name="salaryMin" value={form.salaryMin} onChange={handleChange} />
        </label>

        <label>
          Maximum salary
          <input type="number" min="0" name="salaryMax" value={form.salaryMax} onChange={handleChange} />
        </label>

        <label className="full">
          Required skills (comma separated)
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL"
          />
        </label>

        <label className="full">
          Description
          <textarea name="description" rows="6" value={form.description} onChange={handleChange} required />
        </label>

        <label className="full">
          Requirements
          <textarea name="requirements" rows="4" value={form.requirements} onChange={handleChange} />
        </label>

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? 'Publishing...' : 'Publish job'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}
