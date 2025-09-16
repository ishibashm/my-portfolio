'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {navLinks.map(({ href, label }) => (
        <Link
          href={href}
          key={href}
          className={pathname === href ? styles.active : ''}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
