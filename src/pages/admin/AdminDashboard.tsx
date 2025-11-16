import { Activity, Users, AlertCircle, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { navigate } from '../../components/Router';

export function AdminDashboard() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the injury management system</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Total Students"
            value="0"
            color="blue"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-teal-600" />}
            title="Practitioners"
            value="0"
            color="teal"
          />
          <StatCard
            icon={<AlertCircle className="w-8 h-8 text-orange-600" />}
            title="Active Injuries"
            value="0"
            color="orange"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            title="Resolved Cases"
            value="0"
            color="green"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Overview</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Manage users, assign practitioners to injured students, and monitor recovery progress across the platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
              Manage Users
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50',
    teal: 'bg-teal-50',
    orange: 'bg-orange-50',
    green: 'bg-green-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className={`w-14 h-14 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
    </div>
  );
}
