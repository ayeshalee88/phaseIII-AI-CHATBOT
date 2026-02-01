// pages/signup.tsx - COMPLETE REPLACEMENT

import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import styles from "../styles/Login.module.css";
import Image from "next/image";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ Call NextAuth signup API (not FastAPI backend)
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Signup status:', signupResponse.status);

      let signupData;
      try {
        const text = await signupResponse.text();
        if (text) {
          signupData = JSON.parse(text);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Invalid server response');
      }

      if (!signupResponse.ok) {
        throw new Error(signupData?.message || 'Signup failed');
      }

      console.log('✅ Signup successful');

      // ✅ Auto-login after signup
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('Login result:', loginResult);

      if (loginResult?.error) {
        setError('Account created but login failed. Please try logging in.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      if (loginResult?.ok) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      // ✅ Google sign-in with proper callback
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true, // Let NextAuth handle redirect
      });
      
      // If redirect is false, handle manually
      if (result?.error) {
        setError("Google sign-in failed: " + result.error);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div className={styles.loginBox}>
        <div className={styles.logoWrapper}>
          <Image src="/icons/ayismm.png" width={50} height={50} alt="Logo" priority />
        </div>
        <h2>Create Account</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        {/* Google Sign-In Button */}
        <button 
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
          disabled={loading}
          type="button"
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing up..." : "Continue with Google"}
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.signupLink}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
