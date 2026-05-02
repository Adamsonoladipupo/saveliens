import styles from './SignIn.module.css';
import { Link } from 'react-router';
import logo from "../assets/saveliens_logo.png"

const socialLogins = [
  {
    name: 'Google',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Apple',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <rect x="1" y="1" width="10" height="10" fill="#F35325"/>
        <rect x="13" y="1" width="10" height="10" fill="#81BC06"/>
        <rect x="1" y="13" width="10" height="10" fill="#05A6F0"/>
        <rect x="13" y="13" width="10" height="10" fill="#FFBA08"/>
      </svg>
    ),
  },
  {
    name: 'Slack',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
        <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
        <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.521 2.522v6.312z"/>
        <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zm0-1.27a2.527 2.527 0 0 1-2.521-2.521 2.526 2.526 0 0 1 2.521-2.521h6.312A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.523 2.521h-6.312z"/>
      </svg>
    ),
  },
];

export default function SignIn() {
  return (
    <div className={styles.page}>
      <div className={styles.bgBlue} />
      <header className={styles.header}>
        <div className={styles.logoWrap}>
            <div><Link to="/"><img src={logo} alt="logo" /></Link></div>
        </div>
        <Link to="/signup"><button className={styles.headerSignup}>
        Sign up
        </button></Link>
      </header>

      <h2 className={styles.pageTitle}>Sign In</h2>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.formPanel}>
            <p className={styles.newTo}>
              New to Saveliens?{' '}
              <Link to="/signup"><button className={styles.signupLink}>
                Sign up
              </button></Link>
            </p>

            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputFocused}`}
                type="email"
                placeholder="E-mail"
              />
            </div>

            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
              />
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Forgot your password?</a>
              <a href="#" className={styles.forgotLink}>Problems logging in?</a>
            </div>

            <button className={styles.loginBtn}>Log In</button>

            <div className={styles.socialGrid}>
              {socialLogins.map((s) => (
                <button key={s.name} className={styles.socialBtn}>
                  {s.icon}
                  <span>Log in with {s.name}</span>
                </button>
              ))}
            </div>

            <p className={styles.disclaimer}>
              If you click "Log in with Facebook" or "Log in with Google" and are not a Saveliens user, you will be registered, and you agree to Saveliens's{' '}
              <a href="#" className={styles.inlineLink}>Terms &amp; Conditions</a> and{' '}
              <a href="#" className={styles.inlineLink}>Privacy Policy</a>.
            </p>
          </div>

          <div className={styles.promoPanel}>
            <div className={styles.promoBg} />
            <div className={styles.promoContent}>
              <h2 className={styles.promoTitle}>
                Save and organize links by topic.
              </h2>
              <p className={styles.promoDesc}>
                Build a smarter, more structured collection of resources
              </p>
              <button className={styles.promoBtn}>See how</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}