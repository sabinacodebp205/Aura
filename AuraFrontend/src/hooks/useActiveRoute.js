import { useLocation } from 'react-router-dom';

export function useActiveRoute() {
  const { pathname } = useLocation();

  return (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));
}
