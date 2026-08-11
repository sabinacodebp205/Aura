import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout/MainLayout';
import StudioLayout from './components/templates/StudioLayout/StudioLayout';
import HomePage from './pages/HomePage/HomePage';
import InspirationPage from './pages/InspirationPage/InspirationPage';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import StudioPage from './pages/StudioPage/StudioPage';
import CartPage from './pages/CartPage/CartPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProductPage from './pages/ProductPage/ProductPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product" element={<Navigate to="/product/studio-oversized-hoodie" replace />} />
      </Route>
      <Route element={<StudioLayout />}>
        <Route path="/studio" element={<StudioPage />} />
      </Route>
    </Routes>
  );
}
