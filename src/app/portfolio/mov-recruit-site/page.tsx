"use client";
import Image from 'next/image';
import styles from './mov-recruit-site.module.css';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

const ParallaxMissionSVG = () => {
  const svgRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (svgRef.current) {
        const offset = window.scrollY * 0.15;
        svgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <span ref={svgRef} className={styles.featuresImage} style={{ transition: 'transform 0.3s' }}>
      <svg width="100%" viewBox="0 0 900 180" xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="60" fontFamily="'Noto Sans JP', 'Montserrat', sans-serif" fontSize="28" fill="#283E50">
          NEXAは、『テクノロジーで、次の「当たり前」を創造する』をミッションに掲げるテックカンパニーです。
        </text>
        <text x="50" y="110" fontFamily="'Noto Sans JP', 'Montserrat', sans-serif" fontSize="24" fill="#283E50">
          あなたの才能が、世界を動かす力になる。その挑戦の始まりが、ここにあります。
        </text>
      </svg>
    </span>
  );
};

const images = [
  "/images/gallery/gallery-1.webp",
  "/images/gallery/gallery-2.webp",
  "/images/gallery/gallery-3.webp",
  "/images/gallery/gallery-4.webp",
  "/images/gallery/gallery-5.webp",
  "/images/gallery/gallery-6.webp",
];

const Scroller = ({ reverse = false }: { reverse?: boolean }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerInner = scroller.querySelector(`.${styles.scrollerInner}`);
    if (!scrollerInner) return;

    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement;
      duplicatedItem.setAttribute("aria-hidden", "true");
      scrollerInner.appendChild(duplicatedItem);
    });
  }, []);

  return (
    <div ref={scrollerRef} className={`${styles.scroller} ${reverse ? styles.scrollerReverse : ''}`}>
      <div className={styles.scrollerInner}>
        {images.map((src, index) => (
          <Image key={index} src={src} alt={`Gallery ${index + 1}`} width={400} height={300} />
        ))}
      </div>
    </div>
  );
};


const MovRecruitSitePage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const refCurrent = featuresRef.current;
    if (!refCurrent) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(refCurrent);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Head>
        <title>株式会社mov 採用サイト</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.featuresImage}>
                <svg width="100%" viewBox="0 0 900 180" xmlns="http://www.w3.org/2000/svg">
                  {/* SVGパス等が必要ならここに追加 */}
                </svg>
              </span>
              <h1 className={styles.heroTitle}>株式会社NEXA 採用サイト</h1>
              <p className={styles.heroSubtitle}>NEXAは、『テクノロジーで、次の「当たり前」を創造する』をミッションに掲げるテックカンパニーです。<br />あなたの才能が、世界を動かす力になる。その挑戦の始まりが、ここにあります。</p>
              <div className={styles.scroll}>OUR STORY BEGINS</div>
            </div>
          </section>
          <section className={styles.features}>
            <div
              ref={featuresRef}
              className={
                isVisible
                  ? `${styles.featuresTextBlock} ${styles.isVisible}`
                  : styles.featuresTextBlock
              }
            >
              <ParallaxMissionSVG />
              <p className={styles.featuresLead}>NEXAは、『テクノロジーで、次の「当たり前」を創造する』をミッションに掲げるテックカンパニーです。</p>
              <p className={styles.featuresMission}>あなたの才能が、世界を動かす力になる。その挑戦の始まりが、ここにあります。</p>
            </div>
          </section>
          <section className={styles.jobs}>
            <h2 className={styles.sectionTitle}>募集中のポジション</h2>
            <div className={styles.jobList}>
              <div className={styles.jobCard}>
                <h4><span className={styles.animatedTextHover}>Webエンジニア</span></h4>
                <p>自社サービスの開発・運用を担当していただきます。</p>
                <span className={styles.jobTag}>正社員</span>
              </div>
              <div className={styles.jobCard}>
                <h4><span className={styles.animatedTextHover}>Webデザイナー</span></h4>
                <p>自社サービスやLPのデザインを担当していただきます。</p>
                <span className={styles.jobTag}>正社員</span>
              </div>
              <div className={styles.jobCard}>
                <h4><span className={styles.animatedTextHover}>Webマーケター</span></h4>
                <p>自社サービスのマーケティング戦略の立案・実行を担当していただきます。</p>
                <span className={styles.jobTag}>契約社員</span>
              </div>
            </div>
          </section>

          {/* About Us セクション */}
          <section className={styles.aboutUsSection}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <div className={styles.aboutUsContent}>
              <p>
                NEXAは「テクノロジーで、次の“当たり前”を創造する」をミッションに掲げ、
                社会やビジネスの課題を解決するプロダクト・サービスを開発しています。
              </p>
              <p>
                私たちは多様なバックグラウンドを持つメンバーが集まり、
                互いの個性や専門性を尊重しながら、
                チームで新しい価値を生み出すことを大切にしています。
              </p>
              <p>
                未来志向・挑戦・成長・誠実をキーワードに、
                社会にインパクトを与える事業を次々と生み出していきます。
              </p>
            </div>
          </section>
          {/* Photo Gallery セクション */}
          <section className={styles.photoGallerySection}>
            <h3 className={styles.photoGalleryTitle}>Photo Gallery</h3>
            <p className={styles.photoGallerySubtitle}>フォトギャラリー</p>
            <Scroller />
            <Scroller reverse={true} />
          </section>
        </main>
      </div>
    </>
  );
}

export default MovRecruitSitePage;