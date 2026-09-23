import type { FC, ReactNode } from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  sidebarContent: ReactNode;
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ sidebarContent, children }) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.layout__sidebar} aria-label="Головна навігація">
        {sidebarContent}
      </aside>
      <main className={styles.layout__main} id="main-content">
        {children}
      </main>
    </div>
  );
};