import { useState } from 'react';
import { login, register, forgotPassword, resetPassword, googleLogin } from '../services/api';

const T = {
  bg:         'var(--color-bg)',
  primary:    'var(--color-text-primary)',
  secondary:  'var(--color-text-secondary)',
  muted:      'var(--color-text-muted)',
  border:     'var(--color-border)',
  surface:    'var(--color-surface)',
  red:        'var(--color-red)',
  mono:       'var(--font-mono)',
  radius:     'var(--radius)',
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function LoginForm({ onAuth }) {
  const [mode,  setMode]  = useState('login');  // 'login' | 'register' | 'forgot' | 'reset'
  const [form,  setForm]  = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'intern', token: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [fpSent, setFpSent] = useState(false);

  async function handleGoogle() {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in not configured (VITE_GOOGLE_CLIENT_ID missing)');
      return;
    }
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token&scope=email%20profile`;
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');

    if (mode === 'forgot') {
      try {
        const data = await forgotPassword(form.email);
        setResetToken(data.resetToken);
        setFpSent(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setBusy(false);
        return;
      }
      try {
        await resetPassword(form.token, form.password, form.confirmPassword);
        setError('');
        setMode('login');
        setForm({ ...form, password: '', confirmPassword: '', token: '' });
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
      return;
    }

    if (mode === 'register') {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        setError('All fields are required');
        setBusy(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setBusy(false);
        return;
      }
    }
    try {
      const data = mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password, form.role, form.confirmPassword);
      onAuth(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px',
    border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontFamily: T.mono, fontSize: 13, background: T.surface,
    color: T.primary, marginBottom: 12, outline: 'none',
  };

  if (mode === 'forgot' || mode === 'reset') {
    return (
      <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: T.mono }}>
        <div style={{ borderBottom: `1.5px solid ${T.primary}`, paddingBottom: 16, marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.12em', color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>VICHARANASHALA / INTERNSHIP</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>OAQ SYSTEM</div>
        </div>

        {mode === 'forgot' && !fpSent && (
          <form onSubmit={submit}>
            <div style={{ fontSize: 12, color: T.secondary, marginBottom: 20 }}>Enter your email to receive a reset token</div>
            <input style={inputStyle} type="email" placeholder="EMAIL" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            {error && <div style={{ fontSize: 11, color: T.red, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={busy} style={{ width: '100%', padding: '12px', background: T.primary, color: T.bg, border: 'none', borderRadius: T.radius, fontFamily: T.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? 'SENDING...' : 'SEND RESET TOKEN'}
            </button>
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: T.muted }}>
              <span onClick={() => { setMode('login'); setError(''); setFpSent(false); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Back to login</span>
            </div>
          </form>
        )}

        {mode === 'forgot' && fpSent && (
          <div>
            <div style={{ fontSize: 12, color: T.secondary, marginBottom: 12 }}>Use this token to reset your password:</div>
            <div style={{ background: T.surface, padding: 12, borderRadius: T.radius, border: `1px solid ${T.border}`, fontSize: 11, fontFamily: T.mono, wordBreak: 'break-all', marginBottom: 20, color: T.primary }}>{resetToken}</div>
            <button onClick={() => { setMode('reset'); setForm({ ...form, token: resetToken }); }} style={{ width: '100%', padding: '12px', background: T.primary, color: T.bg, border: 'none', borderRadius: T.radius, fontFamily: T.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 8 }}>
              CONTINUE TO RESET
            </button>
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: T.muted }}>
              <span onClick={() => { setMode('login'); setError(''); setFpSent(false); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Back to login</span>
            </div>
          </div>
        )}

        {mode === 'reset' && (
          <form onSubmit={submit}>
            <div style={{ fontSize: 12, color: T.secondary, marginBottom: 20 }}>Enter the token and your new password</div>
            <input style={inputStyle} placeholder="RESET TOKEN" value={form.token} onChange={e => setForm({ ...form, token: e.target.value })} required />
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder="NEW PASSWORD" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <span onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: 13, color: T.muted, userSelect: 'none' }}>{showPw ? '🙈' : '👁'}</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: 40 }} type={showCp ? 'text' : 'password'} placeholder="CONFIRM NEW PASSWORD" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
              <span onClick={() => setShowCp(!showCp)} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: 13, color: T.muted, userSelect: 'none' }}>{showCp ? '🙈' : '👁'}</span>
            </div>
            {error && <div style={{ fontSize: 11, color: T.red, marginBottom: 12 }}>{error}</div>}
            <button type="submit" disabled={busy} style={{ width: '100%', padding: '12px', background: T.primary, color: T.bg, border: 'none', borderRadius: T.radius, fontFamily: T.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}>
              {busy ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: T.muted }}>
              <span onClick={() => { setMode('login'); setError(''); setFpSent(false); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Back to login</span>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: T.mono }}>
      <div style={{ borderBottom: `1.5px solid ${T.primary}`, paddingBottom: 16, marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', color: T.muted, textTransform: 'uppercase', marginBottom: 4 }}>VICHARANASHALA / INTERNSHIP</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>OAQ SYSTEM</div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `0.5px solid ${T.border}` }}>
        {['login', 'register'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            background: 'none', border: 'none', padding: '8px 16px 10px',
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', color: mode === m ? T.primary : T.muted,
            borderBottom: `2px solid ${mode === m ? T.primary : 'transparent'}`,
            fontFamily: T.mono,
          }}>{m}</button>
        ))}
      </div>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <>
            <input style={inputStyle} placeholder="FULL NAME" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="intern">INTERN</option>
              <option value="mentor">MENTOR</option>
            </select>
          </>
        )}
        <input style={inputStyle} type="email" placeholder="EMAIL" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <div style={{ position: 'relative' }}>
          <input style={{ ...inputStyle, paddingRight: 40 }} type={showPw ? 'text' : 'password'} placeholder="PASSWORD" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <span onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: 13, color: T.muted, userSelect: 'none' }}>{showPw ? '🙈' : '👁'}</span>
        </div>
        {mode === 'register' && (
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showCp ? 'text' : 'password'} placeholder="CONFIRM PASSWORD" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
            <span onClick={() => setShowCp(!showCp)} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer', fontSize: 13, color: T.muted, userSelect: 'none' }}>{showCp ? '🙈' : '👁'}</span>
          </div>
        )}
        {error && <div style={{ fontSize: 11, color: T.red, marginBottom: 12, letterSpacing: '0.06em' }}>{error}</div>}
        <button type="submit" disabled={busy} style={{ width: '100%', padding: '12px', background: T.primary, color: T.bg, border: 'none', borderRadius: T.radius, fontFamily: T.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
        {mode === 'login' && (
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <span onClick={() => { setMode('forgot'); setError(''); }} style={{ fontSize: 11, color: T.muted, cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</span>
          </div>
        )}
      </form>

      <div style={{ marginTop: 20, textAlign: 'center', borderTop: `0.5px solid ${T.border}`, paddingTop: 20 }}>
        <button onClick={handleGoogle} style={{
          width: '100%', padding: '10px', background: T.surface, color: T.primary,
          border: `1px solid ${T.border}`, borderRadius: T.radius, fontFamily: T.mono,
          fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          SIGN IN WITH GOOGLE
        </button>
      </div>
    </div>
  );
}
