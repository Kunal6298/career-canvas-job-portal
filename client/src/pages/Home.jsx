import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <div>
        <span className="eyebrow">Your next chapter starts here</span>
        <h1>Work that fits your ambition.</h1>
        <p>Discover roles from growing teams, track every application, and build a profile recruiters remember.</p>
        <div className="actions">
          <Link className="button" to="/jobs">Explore jobs</Link>
          <Link className="button secondary" to="/register">Create profile</Link>
        </div>
      </div>
      <aside className="hero-panel">
        <p className="eyebrow">Built for momentum</p>
        <strong>One place for your entire job search.</strong>
        <ul>
          <li>Curated opportunities</li>
          <li>Simple application tracking</li>
          <li>Recruiter-ready profiles</li>
        </ul>
      </aside>
    </section>
  );
}
