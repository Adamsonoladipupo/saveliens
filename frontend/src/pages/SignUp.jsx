import { useState } from 'react';
import styles from './SignUp.module.css';
import { Link, useNavigate } from 'react-router';
import logo from "../assets/saveliens_logo.png";

const API_BASE = 'http://localhost:8080/api/users';

const occupations = [
  'Student',
  'Teacher',
  'Business_Professional',
  'Designer',
  'Developer',
  'Marketing',
  'Consultant',
  'Freelancer',
  'Other',
];

const occupationLabels = {
  Student: 'Student',
  Teacher: 'Teacher',
  Business_Professional: 'Business Professional',
  Designer: 'Designer',
  Developer: 'Developer',
  Marketing: 'Marketing',
  Consultant: 'Consultant',
  Freelancer: 'Freelancer',
  Other: 'Other',
};

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  occupation: '',
  agreed: false,
};

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (!form.occupation) errs.occupation = 'Please select an occupation.';
    if (!form.agreed) errs.agreed = 'You must confirm your age to continue.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      occupation: form.occupation,  
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        navigate('/signin', { state: { registered: true } });
        return;
      }

      
      const data = await res.json().catch(() => null);
      setApiError(
        data?.message ||
        (res.status === 409 ? 'An account with this email already exists.' :
         res.status === 400 ? 'Please check your details and try again.' :
         'Something went wrong. Please try again later.')
      );
    } catch {
      setApiError('Unable to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgTop} />
      <div className={styles.bgWave} />

      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <Link to="/"><img src={logo} alt="Saveliens logo" /></Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an account</h1>

          
          {apiError && (
            <div className={styles.apiError} role="alert">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            
            <div className={styles.row}>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
              </div>

              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
              </div>
            </div>

            
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            
            <div className={styles.inputWrap}>
              <div className={styles.selectWrap}>
                <select
                  className={`${styles.input} ${styles.select} ${errors.occupation ? styles.inputError : ''}`}
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                >
                  <option value="" disabled>Occupation</option>
                  {occupations.map(o => (
                    <option key={o} value={o}>{occupationLabels[o]}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
              {errors.occupation && <span className={styles.fieldError}>{errors.occupation}</span>}
            </div>

            
            <div className={styles.inputWrap}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="agreed"
                  className={styles.checkbox}
                  checked={form.agreed}
                  onChange={handleChange}
                />
                <span className={styles.checkboxText}>
                  I certify that I am at least 13 years old or I have reached the minimum
                  age limit set out in the laws of my country of residence.{' '}
                  <a href="#" className={styles.link}>Read more →</a>
                </span>
              </label>
              {errors.agreed && <span className={styles.fieldError}>{errors.agreed}</span>}
            </div>

            
            <button
              type="submit"
              className={styles.continueBtn}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : 'Continue'}
            </button>

            <p className={styles.terms}>
              By proceeding, you agree to the{' '}
              <a href="#" className={styles.link}>Terms of Use</a> and{' '}
              <a href="#" className={styles.link}>Privacy Policy</a>.
            </p>

            
            <button type="button" className={styles.googleBtn}>
              <svg width="20" height="20" viewBox="0 0 48 48" className={styles.googleIcon}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </button>

            <p className={styles.switchText}>
              Already have an account?{' '}
              <Link to="/signin" className={styles.switchLink}>Sign In</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}