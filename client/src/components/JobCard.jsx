import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  const salary = job.salary_min
    ? `₹${Number(job.salary_min).toLocaleString('en-IN')}+`
    : 'Salary not listed';

  return (
    <article className="card job-card">
      <div>
        <div className="card-topline">
          <span className="eyebrow">{job.employment_type}</span>
          {job.match_score !== undefined && (
            <span className="match-badge">{job.match_score}% match</span>
          )}
        </div>

        <h3>{job.title}</h3>
        <p>{job.company_name} · {job.location || 'Remote'}</p>

        {!!job.skills?.length && (
          <div className="chips">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span>{salary}</span>
        <Link to={`/jobs/${job.id}`}>View role →</Link>
      </div>
    </article>
  );
}
