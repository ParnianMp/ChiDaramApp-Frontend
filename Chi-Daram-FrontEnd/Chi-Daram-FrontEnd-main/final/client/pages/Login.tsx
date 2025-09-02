import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, loginWithPhone, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    verificationCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'login') {
      // First step: send SMS
      if (loginType === 'phone') {
        if (!formData.phone || !formData.password) {
          setError('لطفاً شماره موبایل و رمز عبور را وارد کنید');
          return;
        }

        // Simulate sending SMS
        setStep('verify');
        setCountdown(120); // 2 minutes countdown

        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Email login doesn't need SMS
        if (!formData.email || !formData.password) {
          setError('لطفاً ایمیل و رمز عبور را وارد کنید');
          return;
        }

        try {
          const success = await login(formData.email, formData.password);
          if (!success) {
            setError('ایمیل یا رمز عبور اشتباه است یا حساب کاربری وجود ندارد. ابتدا ثبت نام کنید');
          } else {
            navigate('/', { replace: true });
          }
        } catch (error) {
          setError('خطا در ورود. دوباره تلاش کن');
        }
      }
    } else {
      // Second step: verify SMS code
      if (!formData.verificationCode) {
        setError('لطفاً کد تأیید را وارد کنید');
        return;
      }

      if (formData.verificationCode.length !== 6) {
        setError('کد تأیید باید ۶ رقم باشد');
        return;
      }

      // In real app, verify the code with backend
      // For demo, accept any 6-digit code
      try {
        const success = await loginWithPhone(formData.phone, formData.password);
        if (!success) {
          setError('شماره موبایل یا رمز عبور اشتباه است یا حساب کاربری وجود ندارد. ابتدا ثبت نام کنید');
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        setError('خطا در تأیید کد. دوباره تلاش کنید');
      }
    }
  };

  const handleResendCode = () => {
    if (countdown === 0) {
      setCountdown(120);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      // Simulate resending SMS
      console.log('Resending SMS code...');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">چ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">چی دارم؟</h1>
          <p className="text-gray-600">سامانه مدیریت وسایل</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">ورود به حساب کاربری</h2>

          {/* Login Type Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                loginType === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>ایمیل</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                loginType === 'phone'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>موبایل</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'login' ? (
              <>
                {/* Email/Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginType === 'email' ? 'ایمیل' : 'شماره موبایل'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {loginType === 'email' ? (
                        <Mail className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Phone className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type={loginType === 'email' ? 'email' : 'tel'}
                      value={loginType === 'email' ? formData.email : formData.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        [loginType]: e.target.value
                      })}
                      className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={loginType === 'email' ? 'your@email.com' : '09123456789'}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pr-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="رمز عبور خود را وارد کنید"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* SMS Verification */}
                <div className="text-center mb-4">
                  <Phone className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">تأیید شماره موبایل</h3>
                  <p className="text-gray-600 text-sm">
                    کد تأیید به شماره {formData.phone} پیامک شد
                  </p>
                </div>

                {/* Verification Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">کد تأیید</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value.replace(/\D/g, '') })}
                    className="block w-full px-3 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="------"
                    disabled={isLoading}
                  />
                </div>

                {/* Resend Code */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      ارسال مجدد کد در {formatTime(countdown)}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      ارسال مجدد کد تأیید
                    </button>
                  )}
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  ← بازگشت
                </button>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  {step === 'login' ? 'در حال ارسال کد...' : 'در حال تأیید...'}
                </>
              ) : (
                step === 'login' ? (loginType === 'phone' ? 'ارسال کد تأیید' : 'ورود') : 'تأیید و ورود'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              حساب کاربری ندارید؟{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ثبت نام کنید
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
