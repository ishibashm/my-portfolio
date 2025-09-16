'use client';
import Link from 'next/link';
import styles from './HomePageTemplate.module.css';

export const HomePageTemplate = () => {
  return (
    <div className={styles.home}>
      <section id="about" className={styles.about}>
        <div className="container">
          <h2 className={styles.sectionTitle}>About Me</h2>
          <div className={styles.aboutContent}>
            <div className={styles.socialLinks}>
              <a href="https://github.com/ishibashm" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                GitHub
              </a>
              <Link href="/portfolio" className={styles.socialButton}>
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};