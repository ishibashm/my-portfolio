'use client';
import React, { useState } from 'react';
import './CorporateSite.css';
import locales from './locales.json';

type Locale = 'en' | 'ja';

export const Header = ({ locale, setLocale }: { locale: Locale, setLocale: (locale: Locale) => void }) => {
  const t = locales[locale];
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="logo">MyCorp</a>
        <nav className="nav">
          <ul>
            <li><a href="#services">{t.nav.services}</a></li>
            <li><a href="#about">{t.nav.about}</a></li>
            <li><a href="#news">{t.nav.news}</a></li>
            <li><a href="#" className="contact-button">{t.nav.contact}</a></li>
          </ul>
        </nav>
        <div className="language-switcher">
          <button onClick={() => setLocale('en')} className={locale === 'en' ? 'active' : ''}>EN</button>
          <button onClick={() => setLocale('ja')} className={locale === 'ja' ? 'active' : ''}>JA</button>
        </div>
      </div>
    </header>
  );
};


export const CorporateSite = () => {
  const [locale, setLocale] = useState<Locale>('ja');
  const t = locales[locale];

  return (
    <div className="content">
      <main>
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">{t.hero.title}</h1>
            <p className="hero-subtitle">{t.hero.subtitle}</p>
          </div>
        </section>

        <section id="services">
          <div className="container">
            <h2 className="section-title">{t.services.title}</h2>
            <div className="services-grid">
              {t.services.items.map(item => (
                <div className="service-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2 className="section-title">{t.about.title}</h2>
            <div className="about-content">
              <p>{t.about.content}</p>
              <dl>
                <dt>{t.about.company}</dt><dd>MyCorp Inc.</dd>
                <dt>{t.about.founded}</dt><dd>2023</dd>
                <dt>{t.about.location}</dt><dd>Tokyo, Japan</dd>
              </dl>
            </div>
          </div>
        </section>

        <section id="news">
          <div className="container">
            <h2 className="section-title">{t.news.title}</h2>
            <ul className="news-list">
              {t.news.items.map(item => (
                <li key={item.title}>
                  <time>{item.date}</time>
                  <a href="#">{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};