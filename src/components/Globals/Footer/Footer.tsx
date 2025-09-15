import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; 2025 My Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;