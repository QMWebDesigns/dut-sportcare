import { Activity, Heart, Users, Shield } from 'lucide-react';
import { Link } from '../components/Link';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold text-gray-900">DUT SportCare</span>
            </div>
            <div className="flex gap-3">
              <Link href="/login" variant="secondary">
                Sign In
              </Link>
              <Link href="/register" variant="primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Comprehensive Injury Management for
              <span className="block text-teal-600 mt-2">DUT Student Athletes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A complete platform connecting injured athletes with healthcare practitioners for faster recovery and better outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" variant="primary" size="large">
                Start Your Recovery Journey
              </Link>
              <Link href="/login" variant="outline" size="large">
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose DUT SportCare?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-teal-600" />}
              title="Track Recovery"
              description="Monitor injury progress with detailed logs and practitioner updates"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-teal-600" />}
              title="Expert Practitioners"
              description="Connect with physiotherapists, chiropractors, and somatologists"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-teal-600" />}
              title="Personalized Care"
              description="Receive customized recovery plans and exercise prescriptions"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-teal-600" />}
              title="Secure Platform"
              description="Your medical data is protected with enterprise-grade security"
            />
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <Step
                number="1"
                title="Report Your Injury"
                description="Log your injury details, severity, and upload medical documentation"
              />
              <Step
                number="2"
                title="Get Assigned"
                description="A health coordinator assigns you to the right practitioner for your needs"
              />
              <Step
                number="3"
                title="Track Progress"
                description="Work with your practitioner, book appointments, and monitor your recovery"
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Your Recovery?
            </h2>
            <p className="text-xl mb-8 text-teal-50">
              Join DUT SportCare today and get connected with the care you need
            </p>
            <Link href="/register" variant="white" size="large">
              Create Your Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-teal-500" />
            <span className="text-lg font-semibold text-white">DUT SportCare</span>
          </div>
          <p className="text-sm">
            Durban University of Technology Student Athlete Injury Management System
          </p>
          <p className="text-sm mt-2 text-gray-400">
            © 2025 DUT SportCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-teal-600">{number}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
