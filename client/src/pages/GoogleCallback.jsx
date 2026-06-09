import { useEffect, useState } from 'react';
import { googleLogin } from '../services/api';

export default function GoogleCallback({ onAuth }) {
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    async function handleCallback() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (!accessToken) {
        setStatus('Google sign-in failed. Close and try again.');
        return;
      }
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const googleUser = await res.json();
        const data = await googleLogin({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id
        });
        onAuth(data.user, data.token);
      } catch {
        setStatus('Google sign-in failed. Close and try again.');
      }
    }
    handleCallback();
  }, []);

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: 'var(--font-mono)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
      {status}
    </div>
  );
}