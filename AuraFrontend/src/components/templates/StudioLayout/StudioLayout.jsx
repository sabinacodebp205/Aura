import { Outlet } from 'react-router-dom';
import Topbar from '../../organisms/Topbar/Topbar';
import BottomNav from '../../organisms/BottomNav/BottomNav';
import styles from './StudioLayout.module.css';

export default function StudioLayout() {
  return (
    <div className={styles.root}>
      <Topbar />
      <Outlet />
      <BottomNav />
    </div>
  );
}
