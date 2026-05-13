import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          ReplyZen
        </div>
        <nav className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How it Works</a>
          <a href="#pricing" className={styles.navLink}>Pricing</a>
        </nav>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.loginBtn}>Log In</Link>
          <Link href="/signup" className={styles.signupBtn}>Start Free Trial</Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroGlowSecondary}></div>
        
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeHighlight}>New</span> ReplyZen 2.0 is now live
          </div>
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
              See Demo
            </Link>
          </div>
          
          {/* Dashboard Preview / Mockup */}
          <div className={styles.dashboardPreview}>
            <div className={styles.dashboardHeader}>
              <div className={styles.dots}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.dashboardUrl}>replyzen.ai/chat</div>
            </div>
            <div className={styles.dashboardBody}>
              <div className={styles.mockupSidebar}>
                <div className={styles.mockupSideItem}></div>
                <div className={styles.mockupSideItem}></div>
                <div className={styles.mockupSideItem}></div>
              </div>
              <div className={styles.mockupChat}>
                <div className={styles.mockupMsgUser}></div>
                <div className={styles.mockupMsgBot}></div>
                <div className={styles.mockupMsgUserShort}></div>
                <div className={styles.mockupMsgBotLong}></div>
                <div className={styles.mockupInput}></div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for the Future of Work</h2>
            <p className={styles.sectionSubtitle}>Everything you need to boost your daily productivity with AI.</p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>⚡</div>
              </div>
              <h3>Lightning Fast</h3>
              <p>Powered by advanced LLMs to deliver instant, context-aware responses to your most complex queries.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>🔒</div>
              </div>
              <h3>Enterprise Security</h3>
              <p>Your data is protected with state-of-the-art encryption and secure, reliable authentication.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>🧠</div>
              </div>
              <h3>Smart Context</h3>
              <p>Maintains context across long conversations for a truly personalized and intelligent experience.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>📊</div>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Monitor usage, track performance metrics, and gain valuable insights from your conversational data.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>🔗</div>
              </div>
              <h3>Seamless Integrations</h3>
              <p>Connect with your favorite tools and platforms to automate workflows effortlessly.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>💬</div>
              </div>
              <h3>Persistent History</h3>
              <p>Never lose a thought. Access your entire conversation history securely from any device.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className={styles.section}>
           <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSubtitle}>Get started in less than 2 minutes.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Create an Account</h3>
              <p className={styles.stepDesc}>Sign up securely using your email address. Verify and log in instantly.</p>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Start a Session</h3>
              <p className={styles.stepDesc}>Initialize a new chat or pick up where you left off from your history.</p>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Ask Anything</h3>
              <p className={styles.stepDesc}>Get intelligent, context-aware answers to help you solve problems faster.</p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={styles.bottomCta}>
          <div className={styles.ctaGlow}></div>
          <h2 className={styles.ctaTitle}>Ready to transform your workflow?</h2>
          <p className={styles.ctaDesc}>Join thousands of users who are already building the future with ReplyZen.</p>
          <Link href="/signup" className={styles.primaryCtaLarge}>
            Get Started for Free
          </Link>
        </section>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}></div>
              ReplyZen
            </div>
            <p className={styles.footerDesc}>The intelligent AI companion for modern professionals.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Product</h4>
              <Link href="#">Features</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Changelog</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Contact</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Legal</h4>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} ReplyZen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
