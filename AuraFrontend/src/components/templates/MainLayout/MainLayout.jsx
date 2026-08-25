import { Outlet } from 'react-router-dom';
import Topbar from '../../organisms/Topbar/Topbar';
import BottomNav from '../../organisms/BottomNav/BottomNav';

import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.root}>
      <Topbar />
      <main>
        <Outlet />
      </main>
      <BottomNav />

    </div>
  );
}
