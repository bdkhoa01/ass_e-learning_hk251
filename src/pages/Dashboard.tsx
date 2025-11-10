import { useAuth } from '@/contexts/AuthContext';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { LecturerDashboard } from '@/components/dashboard/LecturerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

const Dashboard = () => {
  const { role } = useAuth();

  if (role === 'student') return <StudentDashboard />;
  if (role === 'lecturer') return <LecturerDashboard />;
  if (role === 'admin') return <AdminDashboard />;

  return null;
};

export default Dashboard;
