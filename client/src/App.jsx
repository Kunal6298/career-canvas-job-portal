import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import SeekerDashboard from './pages/seeker/SeekerDashboard.jsx';
import MyApplications from './pages/seeker/MyApplications.jsx';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx';
import CreateJob from './pages/recruiter/CreateJob.jsx';
import ManageApplications from './pages/recruiter/ManageApplications.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/seeker" element={<SeekerDashboard />} />
            <Route path="/seeker/applications" element={<MyApplications />} />
          </Route>
          <Route element={<ProtectedRoute roles={['recruiter']} />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs/new" element={<CreateJob />} />
            <Route path="/recruiter/applications" element={<ManageApplications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
