import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, updateJob } from '../../services/jobService.js';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  async function loadJobs() {
    try {
      const data = await getMyJobs();
      setJobs(data.jobs);
      setError('');
    } catch {
      setError('Could not load your job listings.');
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function toggleJobStatus(job) {
    try {
      await updateJob(job.id, { isActive: !job.is_active });
      await loadJobs();
    } catch {
      setError('Could not update this job listing.');
    }
  }

  const totalApplications = jobs.reduce(
    (total, job) => total + job.application_count,
    0,
  );
  const activeJobs = jobs.filter((job) => job.is_active).length;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Recruiter workspace</span>
          <h1>Build your team</h1>
        </div>
        <Link className="button" to="/recruiter/jobs/new">Post a job</Link>
      </div>

      <div className="summary-grid">
        <Link className="card dashboard-card" to="/recruiter/applications">
          <strong>{totalApplications}</strong>
          <span>Total applications</span>
        </Link>
        <div className="card dashboard-card">
          <strong>{activeJobs}</strong>
          <span>Active listings</span>
        </div>
      </div>

      <h2>Your job listings</h2>
      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {jobs.map((job) => (
          <article className="card" key={job.id}>
            <span className="eyebrow">{job.is_active ? 'Active' : 'Closed'}</span>
            <h3>{job.title}</h3>
            <p>{job.application_count} applications</p>
            <div className="actions">
              <Link to={`/jobs/${job.id}`}>View</Link>
              <button className="link-button" onClick={() => toggleJobStatus(job)}>
                {job.is_active ? 'Close listing' : 'Reopen'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {!jobs.length && !error && <p>No jobs posted yet.</p>}
    </section>
  );
}
