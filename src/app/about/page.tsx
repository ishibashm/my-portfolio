import Image from 'next/image';
import styles from './about.module.css';

const AboutPage = () => {
  return (
    <div className={styles.about}>
      <div className="container">
        <section className={styles.vision}>
          <h1>Our Vision & Mission</h1>
          <p className={styles.lead}>私たちは、テクノロジーとクリエイティビティの力で、世界中の人々の心を動かす体験を創造します。</p>
          <div className={styles.mission}>
            <div>
              <h2>Vision</h2>
              <p>デジタル体験を通じて、より豊かで、より繋がりのある社会を実現する。</p>
            </div>
            <div>
              <h2>Mission</h2>
              <p>クライアントの課題に深く寄り添い、本質的な価値を共に創造する。常に学び続け、最高の品質と驚きを提供する。</p>
            </div>
          </div>
        </section>

        <section className={styles.history}>
          <h2>Company History</h2>
          <ul>
            <li><span>2025.04</span>会社設立</li>
            <li><span>2025.08</span>初の自社サービス「Connect」をリリース</li>
            <li><span>2024.01</span>従業員数10名を突破</li>
            <li><span>2024.06</span>「Global Web Design Award 2024」にて金賞を受賞</li>
          </ul>
        </section>

        <section className={styles.members}>
          <h2>Our Team</h2>
          <div className={styles.memberGrid}>
            <div className={styles.memberCard}>
              <Image src="https://via.placeholder.com/150" alt="CEO" width={150} height={150} />
              <h3>Taro Yamada</h3>
              <p className={styles.role}>CEO / Founder</p>
              <p>大手IT企業で10年間、数々のプロジェクトを成功に導いた後、当社を設立。</p>
            </div>
            <div className={styles.memberCard}>
              <Image src="https://via.placeholder.com/150" alt="CTO" width={150} height={150} />
              <h3>Hanako Tanaka</h3>
              <p className={styles.role}>CTO / Co-Founder</p>
              <p>フルスタックエンジニアとして、常に最新技術の導入と開発チームの育成をリード。</p>
            </div>
            <div className={styles.memberCard}>
              <Image src="https://via.placeholder.com/150" alt="CDO" width={150} height={150} />
              <h3>Jiro Suzuki</h3>
              <p className={styles.role}>CDO / Art Director</p>
              <p>数々の受賞歴を持つデザイナー。ユーザーの心に響くデザインでブランド価値を高める。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
