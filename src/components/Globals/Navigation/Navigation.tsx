'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchGraphQLClient } from '@/utils/fetchGraphQL-client'; // 変更
import gql from 'graphql-tag';
import styles from './Navigation.module.css';
import {
  RootQueryToMenuItemConnection,
  MenuItem,
} from '@/gql/graphql';

const menuQuery = gql`
  query GetMenu {
    menuItems(where: { location: PRIMARY }) {
      nodes {
        uri
        label
      }
    }
  }
`;

export const Navigation = () => {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<
    (MenuItem | null)[] | undefined
  >();

  useEffect(() => {
    const getMenuItems = async () => {
      const { data } = await fetchGraphQLClient<{ // 変更
        menuItems: RootQueryToMenuItemConnection;
      }>({ query: menuQuery });
      setMenuItems(data.menuItems.nodes as (MenuItem | null)[]);
    };
    getMenuItems();
  }, []);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={pathname === '/' ? styles.active : ''}>
        Home
      </Link>
      {menuItems?.map((item) => (
        <Link
          href={item?.uri || ''}
          key={item?.uri}
          className={pathname === item?.uri ? styles.active : ''}
        >
          {item?.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
