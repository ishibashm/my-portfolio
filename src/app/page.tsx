// This is the new home page.
// The content from the gradient mesh corporate site will be here.
"use client";

import { useEffect } from 'react';
import './lp-style.css';

export default function HomePage() {
  useEffect(() => {
    let animationEnabled = true;
    let currentColorSet = 0;
    let noiseEnabled = true;

    const colorSets = [
        { primary: '#FF6B6B', secondary: '#4ECDC4', tertiary: '#45B7D1', quaternary: '#FFA07A', quinary: '#98D8C8' },
        { primary: '#FF8A80', secondary: '#FFB74D', tertiary: '#FF7043', quaternary: '#F06292', quinary: '#BA68C8' },
        { primary: '#64B5F6', secondary: '#4DB6AC', tertiary: '#81C784', quaternary: '#7986CB', quinary: '#9575CD' }
    ];

    function updateColors() {
        const colors = colorSets[currentColorSet];
        const root = document.documentElement;
        root.style.setProperty('--color-1', colors.primary);
        root.style.setProperty('--color-2', colors.secondary);
        root.style.setProperty('--color-3', colors.tertiary);
        root.style.setProperty('--color-4', colors.quaternary);
        root.style.setProperty('--color-5', colors.quinary);
    }

    const toggleAnimationBtn = document.getElementById('toggleAnimation');
    if (toggleAnimationBtn) {
      toggleAnimationBtn.addEventListener('click', () => {
          animationEnabled = !animationEnabled;
          document.body.classList.toggle('no-animation', !animationEnabled);
      });
    }

    const changeColorsBtn = document.getElementById('changeColors');
    if (changeColorsBtn) {
      changeColorsBtn.addEventListener('click', () => {
          currentColorSet = (currentColorSet + 1) % colorSets.length;
          updateColors();
      });
    }

    const toggleNoiseBtn = document.getElementById('toggleNoise');
    if (toggleNoiseBtn) {
      toggleNoiseBtn.addEventListener('click', () => {
          noiseEnabled = !noiseEnabled;
          const noiseOverlay = document.querySelector('.noise-overlay') as HTMLElement;
          if(noiseOverlay) noiseOverlay.style.opacity = noiseEnabled ? '0.6' : '0';
      });
    }

    updateColors();
  }, []);

  return (
    <div className="mesh-container">
        <div className="gradient-blob gradient-blob-1"></div>
        <div className="gradient-blob gradient-blob-2"></div>
        <div className="gradient-blob gradient-blob-3"></div>
        <div className="gradient-blob gradient-blob-4"></div>
        <div className="gradient-blob gradient-blob-5"></div>
        
        <div className="noise-overlay"></div>
        
        <div className="content">
            <header className="header">
                <div className="container">
                <div className="header-inner">
                    <a href="#" className="logo">Next-Gen Corp.</a>
                    <nav className="nav">
                    <ul>
                        <li><a href="#services">事業内容</a></li>
                        <li><a href="#about">会社概要</a></li>
                        <li><a href="#news">お知らせ</a></li>
                        <li><a href="#contact" className="contact-button">お問い合わせ</a></li>
                    </ul>
                    </nav>
                </div>
                </div>
            </header>

            <main>
                <section className="hero">
                <div className="container">
                    <h1 className="hero-title">未来を創造するテクノロジー</h1>
                    <p className="hero-subtitle">私たちは最先端の技術で、新しい価値を提供します。</p>
                    <div className="controls">
                        <button className="control-btn" id="toggleAnimation">アニメーション切替</button>
                        <button className="control-btn" id="changeColors">配色変更</button>
                        <button className="control-btn" id="toggleNoise">ノイズ切替</button>
                    </div>
                </div>
                </section>

                <section id="services" className="services">
                <div className="container">
                    <h2 className="section-title">事業内容</h2>
                    <div className="services-grid">
                    <div className="service-item">
                        <h3>DXコンサルティング</h3>
                        <p>お客様のビジネス課題を解決するための最適なDX戦略を提案します。</p>
                    </div>
                    <div className="service-item">
                        <h3>システム開発</h3>
                        <p>Webアプリケーションから基幹システムまで、高品質なシステムを開発します。</p>
                    </div>
                    <div className="service-item">
                        <h3>AIソリューション</h3>
                        <p>AIを活用したデータ分析、業務自動化などのソリューションを提供します。</p>
                    </div>
                    </div>
                </div>
                </section>

                <section id="about" className="about">
                <div className="container">
                    <h2 className="section-title">会社概要</h2>
                    <div className="about-content">
                    <dl>
                        <dt>会社名</dt>
                        <dd>Next-Gen Corp.</dd>
                        <dt>設立</dt>
                        <dd>2025年9月</dd>
                        <dt>代表者</dt>
                        <dd>石橋 太郎</dd>
                        <dt>所在地</dt>
                        <dd>東京都千代田区丸の内1-1-1</dd>
                    </dl>
                    </div>
                </div>
                </section>

                <section id="news" className="news">
                <div className="container">
                    <h2 className="section-title">お知らせ</h2>
                    <ul className="news-list">
                    <li>
                        <time dateTime="2025-09-11">2025.09.11</time>
                        <a href="#">コーポレートサイトをリニューアルしました。</a>
                    </li>
                    <li>
                        <time dateTime="2025-08-01">2025.08.01</time>
                        <a href="#">夏季休業のお知らせ。</a>
                    </li>
                    <li>
                        <time dateTime="2025-07-15">2025.07.15</time>
                        <a href="#">新サービス「AI-Driven Analytics」をリリースしました。</a>
                    </li>
                    </ul>
                </div>
                </section>
            </main>

            <footer id="contact" className="footer">
                <div className="container">
                <p>&copy; 2025 Next-Gen Corp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </div>
  );
}