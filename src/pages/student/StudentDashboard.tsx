import { useEffect, useState } from 'react';
import { Activity, Plus, Calendar, MessageCircle, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { navigate } from '../../components/Router';
import type { Database } from '../../lib/database.types';

type Injury = Database['public']['Tables']['injuries']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  practitioner: { full_name: string };
};

export function StudentDashboard() {
  const { profile, signOut } = useAuth();
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [injuriesRes, appointmentsRes] = await Promise.all([
        supabase
          .from('injuries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('appointments')
          .select(`
            *,
            practitioner:users!appointments_practitioner_id_fkey(full_name)
          `)
          .gte('appointment_date', new Date().toISOString())
          .order('appointment_date', { ascending: true })
          .limit(5),
      ]);

      if (injuriesRes.data) setInjuries(injuriesRes.data);
      if (appointmentsRes.data) setUpcomingAppointments(appointmentsRes.data as any);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-teal-100 text-teal-800';
      case 'in_treatment':
        return 'bg-indigo-100 text-indigo-800';
      case 'recovering':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your injuries and manage your recovery</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard
            icon={<Plus className="w-6 h-6" />}
            title="Report Injury"
            onClick={() => navigate('/student/report-injury')}
            color="teal"
          />
          <QuickActionCard
            icon={<Calendar className="w-6 h-6" />}
            title="Appointments"
            onClick={() => navigate('/student/appointments')}
            color="blue"
          />
          <QuickActionCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Messages"
            onClick={() => navigate('/student/messages')}
            color="green"
          />
          <QuickActionCard
            icon={<FileText className="w-6 h-6" />}
            title="Medical Records"
            onClick={() => navigate('/student/records')}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Injuries</h2>
              <button
                onClick={() => navigate('/student/report-injury')}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Report New
              </button>
            </div>
            {injuries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No injuries reported yet</p>
                <button
                  onClick={() => navigate('/student/report-injury')}
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Report Your First Injury
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {injuries.map((injury) => (
                  <div
                    key={injury.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer"
                    onClick={() => navigate(`/student/injury/${injury.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{injury.injury_type}</h3>
                        <p className="text-sm text-gray-600">{injury.body_part}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(injury.severity)}`}>
                        {injury.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(injury.status)}`}>
                        {injury.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(injury.date_reported).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <button
                onClick={() => navigate('/student/appointments')}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All
              </button>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.practitioner.full_name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.appointment_date).toLocaleString('en-ZA', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                    {appointment.location && (
                      <div className="text-xs text-gray-500 mt-1">{appointment.location}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  color: string;
}) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  };

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 border-transparent hover:border-current transition-all text-left ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="mb-3">{icon}</div>
      <div className="font-semibold">{title}</div>
    </button>
  );
}
