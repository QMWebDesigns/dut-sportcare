import { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { navigate } from '../../components/Router';

const INJURY_TYPES = [
  'Sprain', 'Strain', 'Fracture', 'Dislocation', 'Concussion',
  'Contusion', 'Laceration', 'Tendinitis', 'Ligament Tear', 'Other'
];

const BODY_PARTS = [
  'Ankle', 'Knee', 'Hip', 'Lower Back', 'Upper Back', 'Shoulder',
  'Elbow', 'Wrist', 'Hand', 'Neck', 'Head', 'Hamstring', 'Calf', 'Quad', 'Other'
];

export function ReportInjury() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    injury_type: '',
    body_part: '',
    severity: 'moderate' as 'mild' | 'moderate' | 'severe',
    description: '',
    date_occurred: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('injuries').insert({
        student_id: user!.id,
        injury_type: formData.injury_type,
        body_part: formData.body_part,
        severity: formData.severity,
        description: formData.description,
        date_occurred: formData.date_occurred,
        status: 'reported',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to report injury. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Injury Reported</h2>
          <p className="text-gray-600">
            Your injury has been reported successfully. A health coordinator will assign you to a practitioner soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Injury</h1>
          <p className="text-gray-600 mb-8">
            Provide details about your injury so we can assign you to the right practitioner
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Injury
              </label>
              <select
                value={formData.injury_type}
                onChange={(e) => setFormData({ ...formData, injury_type: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="">Select injury type</option>
                {INJURY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Part Affected
              </label>
              <select
                value={formData.body_part}
                onChange={(e) => setFormData({ ...formData, body_part: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="">Select body part</option>
                {BODY_PARTS.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['mild', 'moderate', 'severe'] as const).map((severity) => (
                  <button
                    key={severity}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity })}
                    className={`p-4 border-2 rounded-lg text-center capitalize transition-all ${
                      formData.severity === severity
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Injury
              </label>
              <input
                type="date"
                value={formData.date_occurred}
                onChange={(e) => setFormData({ ...formData, date_occurred: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                placeholder="Describe how the injury occurred, symptoms you're experiencing, and any other relevant details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Reporting...' : 'Report Injury'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
