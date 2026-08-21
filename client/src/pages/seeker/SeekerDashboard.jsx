import { Link } from 'react-router-dom';

const dashboardLinks = [
  {
    title: 'Browse jobs',
    description: 'Find your next opportunity.',
    path: '/jobs',
  },
  {
    title: 'My applications',
    description: 'Track application progress.',
    path: '/seeker/applications',
  },
  {
    title: 'Profile',
    description: 'Keep your details current.',
    path: '/profile',
  },
];

export default function SeekerDashboard() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Job seeker</span>
          <h1>Your search, organized</h1>
        </div>
      </div>

      <div className="card-grid">
        {dashboardLinks.map((item) => (
          <Link className="card dashboard-card" to={item.path} key={item.path}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
