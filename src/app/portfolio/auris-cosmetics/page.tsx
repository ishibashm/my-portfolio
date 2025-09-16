'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
// import Navigation from '@/components/Globals/Navigation/Navigation';
// import Footer from '@/components/Globals/Footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './auris-cosmetics.module.css';

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add(styles.isVisible);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.animatedSection} ${className || ''}`}>
      {children}
    </div>
  );
};

const testimonialsData = [
  {
    name: '佐藤様 45歳',
    comment: '使い始めてから、肌のトーンが明るくなった気がします。友人にも「何か変えた？」と聞かれることが増えました。',
    avatar: '/images/auris/user1.png'
  },
  {
    name: '鈴木様 52歳',
    comment: '乾燥が気にならなくなり、一日中しっとり感が続きます。少量でよく伸びるので、コスパも良いですね。',
    avatar: '/images/auris/user2.png'
  },
  {
    name: '高橋様 48歳',
    comment: '高級感のある香りに癒されます。毎晩のお手入れが楽しみになりました。肌にハリが出てきたように感じます。',
    avatar: '/images/auris/user3.png'
  }
];

const Testimonials = () => {
  return (
    <section className={styles.testimonials}>
      <AnimatedSection>
        <h2 className={styles.sectionTitle}>喜びの声が続々と</h2>
      </AnimatedSection>
      <AnimatedSection>
        <Swiper
          modules={[SwiperNavigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className={styles.swiperContainer}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
        >
          {testimonialsData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className={styles.testimonialItem}>
                <p className={styles.testimonialComment}>"{testimonial.comment}"</p>
                <div className={styles.testimonialAuthor}>
                  <Image src={testimonial.avatar} alt={testimonial.name} width={60} height={60} className={styles.testimonialAvatar} />
                  <span className={styles.testimonialName}>{testimonial.name}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </AnimatedSection>
    </section>
  );
}


const AurisCosmeticsPage = () => {
  return (
    <div className={styles.aurisLpContainer}>
      {/* <Navigation /> */}
      <main className={styles.aurisLp}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>一滴に、時を超える輝きを。</h1>
            <p className={styles.heroSubtitle}>Aurisプレミアムセラムで、未体験のハリと艶へ。</p>
            <a href="#cta" className={styles.heroButton}>初回限定 1,980円ではじめる</a>
          </div>
          <div className={styles.heroBackground}></div>
        </section>

        <AnimatedSection className={styles.features}>
          <h2 className={styles.sectionTitle}>Aurisだけの特別な理由</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>独自の浸透技術</h3>
              <p className={styles.featureText}>ナノ化された美容成分が角質層のすみずみまで届き、内側から輝く肌へ導きます。</p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>厳選された天然成分</h3>
              <p className={styles.featureText}>世界中から集めた希少な植物エキスを贅沢に配合。肌本来の力を引き出します。</p>
            </div>
            <div className={styles.featureItem}>
              <h3 className={styles.featureTitle}>科学的アプローチ</h3>
              <p className={styles.featureText}>長年の皮膚科学研究に基づき、年齢肌の悩みに多角的にアプローチします。</p>
            </div>
          </div>
        </AnimatedSection>

        <section className={styles.ingredients}>
          <AnimatedSection>
            <h2 className={styles.sectionTitle}>奇跡の一滴を構成する成分</h2>
          </AnimatedSection>
          <div className={styles.ingredientItem}>
            <AnimatedSection className={styles.ingredientImageWrapper}>
              <Image src="/images/auris/golden-orchid.png" alt="ゴールデンオーキッド" width={500} height={350} className={styles.ingredientImage} />
            </AnimatedSection>
            <AnimatedSection className={styles.ingredientText}>
              <h3 className={styles.ingredientName}>ゴールデンオーキッドエキス</h3>
              <p>過酷な環境で生き抜く生命力を持つ黄金の蘭から抽出。肌にハリと弾力を与え、若々しい印象へと導きます。</p>
            </AnimatedSection>
          </div>
          <div className={`${styles.ingredientItem} ${styles.reverse}`}>
            <AnimatedSection className={styles.ingredientImageWrapper}>
              <Image src="/images/auris/deep-sea-minerals.png" alt="深層海洋水ミネラル" width={500} height={350} className={styles.ingredientImage} />
            </AnimatedSection>
            <AnimatedSection className={styles.ingredientText}>
              <h3 className={styles.ingredientName}>深層海洋水ミネラル</h3>
              <p>水深200m以深から採取した海洋深層水。豊富なミネラルが肌のバリア機能をサポートし、健やかな状態を保ちます。</p>
            </AnimatedSection>
          </div>
        </section>

        <Testimonials />

        <section id="cta" className={styles.cta}>
          <AnimatedSection>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>さあ、あなたも未体験の輝きへ</h2>
              <p className={styles.ctaText}>
                通常価格15,000円のAurisプレミアムセラムを、<br />
                今なら初回限定で <span className={styles.price}>87% OFF</span> の <span className={styles.priceLarge}>1,980</span>円(税込)でお試しいただけます。
              </p>
              <a href="#" className={styles.ctaButton}>今すぐお得に試してみる</a>
              <p className={styles.ctaNote}>※いつでも解約OK！安心してお試しください。</p>
            </div>
          </AnimatedSection>
        </section>

      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AurisCosmeticsPage;