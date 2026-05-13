import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>ReplyZen</div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Sign Up Free</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.heroGlow}></div>
        
        <div className={styles.hero}>
          <div className={styles.badge}>✨ Introducing ReplyZen 2.0</div>
          <h1 className={styles.title}>
            The Intelligent <br />
            <span className={styles.gradientText}>AI Companion</span>
          </h1>
          <p className={styles.description}>
            Experience the next generation of conversational AI. Supercharge your productivity, streamline workflows, and get instant answers with unprecedented accuracy.
          </p>
          
          <div className={styles.ctas}>
            <Link href="/signup" className={styles.primaryCta}>
              Get Started for Free
              <span className={styles.arrow}>→</span>
            </Link>
            <Link href="/login" className={styles.secondaryCta}>
              Return to Chat
            </Link>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Lightning Fast</h3>
            <p>Powered by advanced LLMs to deliver instant, context-aware responses to your most complex queries.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Enterprise Security</h3>
            <p>Your data is protected with state-of-the-art encryption and secure, reliable authentication.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h3>Smart Context</h3>
            <p>Maintains context across long conversations for a truly personalized and intelligent experience.</p>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} ReplyZen. All rights reserved.</p>
      </footer>
    </div>
  );
}
