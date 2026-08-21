import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { applyToJob } from '../services/applicationService.js';
import { getJob } from '../services/jobService.js';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => { getJob(id).then(setJob).catch(() => setMessage('Job not found.')); }, [id]);

  const apply = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('jobId', id);
    if (resume) form.append('resume', resume);
    try {
      await applyToJob(form);
      setMessage('Application submitted successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Application could not be submitted.');
    }
  };

  if (!job && !message) return <LoadingSpinner />;
  if (!job) return <p className="error">{message}</p>;
  return (
    <article className="details-layout">
      <div className="card details-card">
        <span className="eyebrow">{job.employment_type}</span>
        <h1>{job.title}</h1>
        <p className="lead">{job.company_name} · {job.location || 'Remote'}</p>
        {!!job.skills?.length && <div className="chips">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>}
        <h2>About the role</h2><p>{job.description}</p>
        <h2>Requirements</h2><p>{job.requirements || 'See the description for details.'}</p>
      </div>
      <aside className="card apply-card">
        <h2>Apply now</h2>
        {user?.role === 'seeker' ? (
          <form onSubmit={apply}>
            <label>Resume (PDF or DOCX, max 3 MB)<input type="file" required accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} /></label>
            <button className="button" type="submit">Submit application</button>
          </form>
        ) : <p>Log in as a job seeker to apply.</p>}
        {message && <p className="notice">{message}</p>}
      </aside>
    </article>
  );
}
