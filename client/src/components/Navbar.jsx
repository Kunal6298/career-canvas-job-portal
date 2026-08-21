import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link className="brand" to="/">CandidArc</Link>
        <nav>
          <NavLink to="/jobs">Jobs</NavLink>
          {user?.role === 'recruiter' && <NavLink to="/recruiter">Recruiter</NavLink>}
          {user?.role === 'seeker' && <NavLink to="/seeker">Dashboard</NavLink>}
          {user ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <button className="link-button" onClick={signOut}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link className="button small" to="/register">Join now</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
