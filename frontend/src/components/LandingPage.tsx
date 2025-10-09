import { useState } from 'react';
import { Building2, TrendingUp, Shield } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-6 hidden md:block">
                <h2 className="text-4xl font-bold leading-tight">
                  Transform Your Business Operations
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Streamline your hospitality, commerce, tourism, health, and agriculture
                  operations with our comprehensive management platform.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Multi-Industry Support</h3>
                      <p className="text-slate-400 text-sm">
                        Tailored solutions for diverse business sectors
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Growth Analytics</h3>
                      <p className="text-slate-400 text-sm">
                        Real-time insights to drive business decisions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Enterprise Security</h3>
                      <p className="text-slate-400 text-sm">
                        Bank-level security for your sensitive data
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8">
                {authMode === 'login' ? (
                  <LoginForm onSwitchToSignup={switchToSignup} />
                ) : (
                  <SignupForm onSwitchToLogin={switchToLogin} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">TechOffice Solutions</span>
            </div>
            <button
              onClick={handleSignIn}
              className="px-6 py-2 text-white hover:text-emerald-400 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Elevate Your Business to New Heights
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  A unified platform designed for modern businesses across hospitality,
                  commerce, tourism, healthcare, and agriculture sectors.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                >
                  Get Started Free
                </button>
                <button
                  onClick={handleSignIn}
                  className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">5000+</div>
                  <div className="text-slate-400 text-sm">Active Users</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-slate-400 text-sm">Satisfaction</div>
                </div>
                <div className="w-px h-12 bg-slate-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-slate-400 text-sm">Support</div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Business professional in Lagos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">+145%</div>
                    <div className="text-slate-600 text-sm">Growth Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">All-in-One Platform</h3>
              <p className="text-slate-400 leading-relaxed">
                Manage multiple business sectors from a single, intuitive dashboard designed for efficiency.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
              <p className="text-slate-400 leading-relaxed">
                Gain actionable insights with advanced analytics and reporting tools tailored to your industry.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-slate-400 leading-relaxed">
                Enterprise-grade security with 99.9% uptime guarantee to keep your business running smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
