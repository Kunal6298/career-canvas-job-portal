import { useEffect, useState } from 'react';
import { getMyApplications } from '../../services/applicationService.js';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getMyApplications();
        setApplications(data.applications);
      } catch {
        setError('Could not load your applications.');
      }
    }

    loadApplications();
  }, []);

  return (
    <section>
      <span className="eyebrow">Application tracker</span>
      <h1>My applications</h1>

      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {applications.map((application) => (
          <article className="card" key={application.id}>
            <span className="eyebrow">{application.status}</span>
            <h2>{application.title}</h2>
            <p>{application.company_name}</p>
          </article>
        ))}
      </div>

      {!applications.length && !error && <p>No applications yet.</p>}
    </section>
  );
}
