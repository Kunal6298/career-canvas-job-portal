import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getJobs } from '../services/jobService.js';
import { getRecommendedJobs } from '../services/jobService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommended, setRecommended] = useState(false);
  const { user } = useAuth();

  const loadJobs = async (query = '') => {
    setLoading(true);
    try {
      const data = recommended ? await getRecommendedJobs() : await getJobs({ search: query });
      setJobs(data.jobs);
      setError('');
    } catch {
      setError('Could not load jobs. Make sure the API and database are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, [recommended]);

  const submit = (event) => {
    event.preventDefault();
    loadJobs(search);
  };

  return (
    <section>
      <div className="page-heading">
        <div><span className="eyebrow">Open opportunities</span><h1>Find your next role</h1></div>
        <form className="search" onSubmit={submit}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Role, skill, or company" />
          <button className="button" type="submit">Search</button>
        </form>
      </div>
      {user?.role === 'seeker' && <button className={`recommend-toggle ${recommended ? 'active' : ''}`} onClick={() => setRecommended((value) => !value)}>{recommended ? 'Showing recommended jobs' : 'Show smart recommendations'}</button>}
      {loading ? <LoadingSpinner /> : error ? <p className="error">{error}</p> : (
        <div className="card-grid">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
      )}
    </section>
  );
}
