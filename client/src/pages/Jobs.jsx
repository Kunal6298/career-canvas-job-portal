import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getJobs, getRecommendedJobs } from '../services/jobService.js';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { user } = useAuth();

  async function loadJobs(searchText = '') {
    setLoading(true);
    setError('');

    try {
      const data = showRecommendations
        ? await getRecommendedJobs()
        : await getJobs({ search: searchText });
      setJobs(data.jobs);
    } catch {
      setError('Could not load jobs. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [showRecommendations]);

  function handleSearch(event) {
    event.preventDefault();
    loadJobs(search);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Open opportunities</span>
          <h1>Find your next role</h1>
        </div>

        <form className="search" onSubmit={handleSearch}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Role, skill, or company"
          />
          <button className="button" type="submit">Search</button>
        </form>
      </div>

      {user?.role === 'seeker' && (
        <button
          className={`recommend-toggle ${showRecommendations ? 'active' : ''}`}
          onClick={() => setShowRecommendations((currentValue) => !currentValue)}
        >
          {showRecommendations ? 'Showing recommended jobs' : 'Show smart recommendations'}
        </button>
      )}

      {loading && <LoadingSpinner />}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="card-grid">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </section>
  );
}
