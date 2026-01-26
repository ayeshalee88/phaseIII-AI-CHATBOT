import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Login.module.css';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className={styles.loginContainer}>
        <div></div> {/* Grid */}
        <div></div> {/* Particles */}
        <div></div> {/* Light beam */}
        <div></div> {/* Mesh gradient */}
        <div></div> {/* Glowing lines */}
        <div className={styles.loginBox}>
          <div className={styles.logoWrapper}>
            <Image src="/icons/ayismm.png" 
                  alt="Smart Reminders" 
                  width={50} 
                  height={50} />
          </div>
          <h2>Welcome Back</h2>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className={styles.signupLink}>
            Don&apos;t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
  );
}
