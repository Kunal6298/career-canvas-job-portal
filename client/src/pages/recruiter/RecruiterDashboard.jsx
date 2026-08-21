import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, updateJob } from '../../services/jobService.js';
export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const load = () => getMyJobs().then((data) => setJobs(data.jobs)).catch(() => {});
  useEffect(load, []);
  const toggle = async (job) => { await updateJob(job.id, { isActive: !job.is_active }); load(); };
  return <section><div className="page-heading"><div><span className="eyebrow">Recruiter workspace</span><h1>Build your team</h1></div><Link className="button" to="/recruiter/jobs/new">Post a job</Link></div><div className="summary-grid"><Link className="card dashboard-card" to="/recruiter/applications"><strong>{jobs.reduce((sum, job) => sum + job.application_count, 0)}</strong><span>Total applications</span></Link><div className="card dashboard-card"><strong>{jobs.filter((job) => job.is_active).length}</strong><span>Active listings</span></div></div><h2>Your job listings</h2><div className="card-grid">{jobs.map((job) => <article className="card" key={job.id}><span className="eyebrow">{job.is_active ? 'Active' : 'Closed'}</span><h3>{job.title}</h3><p>{job.application_count} applications</p><div className="actions"><Link to={`/jobs/${job.id}`}>View</Link><button className="link-button" onClick={() => toggle(job)}>{job.is_active ? 'Close listing' : 'Reopen'}</button></div></article>)}</div>{!jobs.length && <p>No jobs posted yet.</p>}</section>;
}
