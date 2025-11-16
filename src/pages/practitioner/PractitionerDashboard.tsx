import { Activity, Users, Calendar, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { navigate } from '../../components/Router';

export function PractitionerDashboard() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold text-gray-900">DUT SportCare</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{profile?.full_name}</span>
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practitioner Dashboard</h1>
          <p className="text-gray-600">Manage your assigned athletes and track their recovery</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8 text-teal-600" />}
            title="Active Cases"
            value="0"
            subtitle="Athletes under your care"
          />
          <StatCard
            icon={<Calendar className="w-8 h-8 text-blue-600" />}
            title="Today's Appointments"
            value="0"
            subtitle="Scheduled sessions"
          />
          <StatCard
            icon={<FileText className="w-8 h-8 text-green-600" />}
            title="Recovery Logs"
            value="0"
            subtitle="Updates this week"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Cases</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            You don't have any assigned athletes yet. When an admin assigns students to you, they'll appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}
