import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

type PurposeOfUse =
  | 'hospitality'
  | 'commerce'
  | 'pharmacy'
  | 'agriculture'
  | 'tourism'
  | 'technical_services'
  | 'other';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company: '',
    address: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });

  const [purposeOfUse, setPurposeOfUse] = useState<Array<PurposeOfUse>>([]);
  const [customPurpose, setCustomPurpose] = useState('');

  // handle field updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // validate before moving to step 2
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setStep(2);
  };

  // handle final submit — signup and store tokens
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!purposeOfUse.length) {
      setError('Please select at least one business category');
      return;
    }

    setLoading(true);

    try {
      const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || 'https://techofficesolutions.onrender.com';

      const finalPurposeArray = purposeOfUse.map((p) =>
        p === 'other' ? customPurpose || 'other' : p
      );

      const payload = {
        username: formData.username,
        email: formData.email,
        company_name: formData.company,
        address: formData.address,
        phone_number: formData.telephone || '',
        password: formData.password,
        purpose_of_use: finalPurposeArray,
      };

      // ---- SIGNUP REQUEST ----
      const signupRes = await fetch(`${BACKEND_URL}/api/users/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        console.error('Signup error:', signupData);
        const errMsg =
          signupData.detail ||
          signupData.message ||
          JSON.stringify(signupData) ||
          'Signup failed';
        throw new Error(errMsg);
      }

      // ✅ Signup succeeded — backend already returned tokens
      localStorage.setItem('t_office_access', signupData.access);
      localStorage.setItem('t_office_refresh', signupData.refresh);
      localStorage.setItem('t_office_user', JSON.stringify(signupData.user));
      window.dispatchEvent(new Event('t_office_auth_changed'));
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    { value: 'hospitality', label: 'Hospitality', icon: '🏨' },
    { value: 'commerce', label: 'Commerce', icon: '🛒' },
    { value: 'pharmacy', label: 'Pharmacy', icon: '💊' },
    { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
    { value: 'tourism', label: 'Tourism', icon: '🧭' },
    { value: 'technical_services', label: 'Technical Services', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <img src="/bisflowpro.png" alt="BisFlowPro" className="h-16" />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          <button
            onClick={() => (step === 1 ? navigate('/') : setStep(1))}
            className="flex items-center text-gray-600 hover:text-green-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {step === 1 ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">Join BisFlowPro and streamline your business</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Company address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telephone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="Company phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password (min. 6 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Building2 className="w-8 h-8 text-green-700" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Purpose of Use</h2>
                <p className="text-gray-600">Select your business category</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {purposeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPurposeOfUse((prev) => {
                          const exists = prev.includes(option.value as PurposeOfUse);
                          if (exists) return prev.filter((p) => p !== option.value);
                          return [...prev, option.value as PurposeOfUse];
                        });
                        if (option.value !== 'other') setCustomPurpose('');
                      }}
                      className={`p-6 border-2 rounded-xl transition-all text-center hover:border-green-600 ${
                        purposeOfUse.includes(option.value as PurposeOfUse)
                          ? 'border-green-700 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-4xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                    </button>
                  ))}
                </div>

                {purposeOfUse.includes('other') && (
                  <div>
                    <label htmlFor="customPurpose" className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify
                    </label>
                    <input
                      id="customPurpose"
                      type="text"
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      placeholder="Enter your business category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !purposeOfUse.length ||
                    (purposeOfUse.includes('other') && !customPurpose)
                  }
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Complete Registration'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
