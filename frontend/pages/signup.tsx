import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Login.module.css';
import Image from 'next/image';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await signup(email, password);
      // Redirect to dashboard or home page after successful signup
      router.push('/');
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err);
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
          <h2>Join Todoify Now</h2>
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
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>
          <p className={styles.signupLink}>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
  );
}    
