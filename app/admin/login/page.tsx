'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('admin_remember_me');
    if (savedRememberMe !== null) {
      setRememberMe(savedRememberMe === 'true');
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        if (authError.message.toLowerCase().includes('invalid')) {
          setError('Incorrect email or password.');
        } else {
          setError(authError.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      // Check email verification if required (Optional enterprise feature)
      // if (!data.user?.email_confirmed_at) {
      //   setError("Please verify your email before signing in.");
      //   return;
      // }

      // Store remember me preference
      localStorage.setItem('admin_remember_me', rememberMe.toString());
      
      // Set localStorage token for dashboard authentication
      localStorage.setItem('admin_token', data.session?.access_token || 'authenticated');
      localStorage.setItem('admin_role', 'admin');

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d2016 0%, #1a3a2a 50%, #0d2016 100%)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative w-full max-w-md px-6">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #c9a227, #e8c547)', boxShadow: '0 8px 32px rgba(201,162,39,0.3)' }}>
            <span className="text-3xl font-bold" style={{ color: '#1a3a2a', fontFamily: 'serif' }}>श</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Admin Portal
          </h1>
          <p className="text-sm" style={{ color: '#c9a227' }}>
            Shree Alankar Public School
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,162,39,0.2)' }}>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#c9a227' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                placeholder="admin@sjss.edu.np"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#c9a227' }}
                onFocus={e => e.target.style.borderColor = '#c9a227'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#c9a227' }}>
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', caretColor: '#c9a227' }}
                  onFocus={e => e.target.style.borderColor = '#c9a227'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#c9a227' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227] focus:ring-offset-[#1a3a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ accentColor: '#c9a227' }}
              />
              <label htmlFor="remember" className="text-sm font-medium select-none cursor-pointer" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Remember me
              </label>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm flex items-start gap-2" style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#f87171' }}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #c9a227, #e8c547)', color: '#1a3a2a', boxShadow: '0 4px 20px rgba(201,162,39,0.3)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Authorized personnel only. All access is logged.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2081 BS · Shree Alankar Public School
          </p>
        </div>
      </div>
    </div>
  );
}
