import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.logo}>
            <Image src="/images/NEXA_logo.png" alt="NEXA" width={200} height={100} />
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <p className={styles.linkTitle}>Recruit site</p>
              <Link href="#" className={styles.link}>会社について</Link>
              <a href="#" rel="noopener noreferrer" target="_blank" className={styles.link}>
                働く人
                <Image src="https://storage.googleapis.com/studio-design-asset-files/projects/1YWjN84ZWm/s-16x16_ef2fa8af-deca-4757-93a1-e52bec22f71f.svg" alt="" width={16} height={16} />
              </a>
              <a href="#" rel="noopener noreferrer" target="_blank" className={styles.link}>
                テックブログ
                <Image src="https://storage.googleapis.com/studio-design-asset-files/projects/1YWjN84ZWm/s-16x16_ef2fa8af-deca-4757-93a1-e52bec22f71f.svg" alt="" width={16} height={16} />
              </a>
              <Link href="#" className={styles.link}>News</Link>
              <Link href="#" className={styles.link}>FAQ</Link>
            </div>
            <div className={styles.linkGroup}>
              <p className={styles.linkTitle}>Services</p>
              
              <a href="#" rel="noopener noreferrer" target="_blank" className={styles.link}>
                コンサルティング
                <Image src="https://storage.googleapis.com/studio-design-asset-files/projects/1YWjN84ZWm/s-16x16_ef2fa8af-deca-4757-93a1-e52bec22f71f.svg" alt="" width={16} height={16} />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.bottomLinks}>
            <a href="#" rel="noopener noreferrer" target="_blank" className={styles.link}>
              コーポレートサイト
              <Image src="https://storage.googleapis.com/studio-design-asset-files/projects/1YWjN84ZWm/s-12x13_9a4173cb-24a5-457f-b2a8-673b77a3bdc2.svg" alt="" width={12} height={13} />
            </a>
            <a href="#" rel="noopener noreferrer" target="_blank" className={styles.link}>
              情報セキュリティポリシー
              <Image src="https://storage.googleapis.com/studio-design-asset-files/projects/1YWjN84ZWm/s-12x13_9a4173cb-24a5-457f-b2a8-673b77a3bdc2.svg" alt="" width={12} height={13} />
            </a>
          </div>
          <p className={styles.copyright}>©2025 NEXA inc.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;