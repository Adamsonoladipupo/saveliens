import { useState } from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router';
import logo from "../assets/saveliens_logo.png"

const occupations = [
  'Student', 'Teacher', 'Business Professional',
  'Designer', 'Developer', 'Marketing',
  'Consultant', 'Freelancer', 'Other',
];

// const departments = [
//   'Engineering', 'Design', 'Marketing', 'Sales',
//   'Human Resources', 'Finance', 'Operations', 'Other',
// ];

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', occupation: '', department: '', agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('signup:', form);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgTop} />
      <div className={styles.bgWave} />

      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <div><Link to="/"><img src={logo} alt="logo" /></Link></div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an account</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputWrap}>
              <select
                className={`${styles.input} ${styles.select}`}
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
              >
                <option value="" disabled>Occupation</option>
                {occupations.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>

            {/* <div className={styles.inputWrap}>
              <select
                className={`${styles.input} ${styles.select} ${!form.occupation ? styles.disabled : ''}`}
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={!form.occupation}
              >
                <option value="" disabled>Department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div> */}

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="agreed"
                className={styles.checkbox}
                checked={form.agreed}
                onChange={handleChange}
                required
              />
              <span className={styles.checkboxText}>
                I certify that I am at least 13 years old or I have reached the minimum age limit set out in the laws of my country of residence.{' '}
                <a href="#" className={styles.link}>Read more →</a>
              </span>
            </label>

            <button type="submit" className={styles.continueBtn}>
              Continue
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
              <Link to="/signin"><button type="button" className={styles.switchLink}>
                Sign In
              </button></Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}