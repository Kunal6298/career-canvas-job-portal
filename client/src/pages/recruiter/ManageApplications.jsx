import { useEffect, useState } from 'react';
import {
  downloadResume,
  getRecruiterApplications,
  updateApplicationStatus,
} from '../../services/applicationService.js';

const applicationStatuses = ['submitted', 'reviewing', 'shortlisted', 'rejected', 'hired'];

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getRecruiterApplications();
        setApplications(data.applications);
      } catch {
        setError('Could not load candidate applications.');
      }
    }

    loadApplications();
  }, []);

  async function handleStatusChange(applicationId, newStatus) {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    } catch {
      setError('Could not update the application status.');
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Hiring pipeline</span>
          <h1>Candidate applications</h1>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {applications.map((application) => (
          <article className="card" key={application.id}>
            <span className="eyebrow">{application.title}</span>
            <h2>{application.applicant_name}</h2>
            <p>{application.applicant_email}</p>

            <label>
              Status
              <select
                value={application.status}
                onChange={(event) => handleStatusChange(application.id, event.target.value)}
              >
                {applicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="button secondary resume-button"
              onClick={() => downloadResume(application.id, application.resume_name)}
            >
              Download resume
            </button>
          </article>
        ))}
      </div>

      {!applications.length && !error && <p>No applications received yet.</p>}
    </section>
  );
}
