import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import InspirationPage from './pages/InspirationPage/InspirationPage';
import AiStudioPage from './pages/AiStudioPage/AiStudioPage';
import CartPage from './pages/CartPage/CartPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProductPage from './pages/ProductPage/ProductPage';
import ProtectedRoute from './components/ProtectedRoute';


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/ai-studio" element={<AiStudioPage />} />
        <Route path="/studio" element={<AiStudioPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product" element={<Navigate to="/product/studio-oversized-hoodie" replace />} />
      </Route>
    </Routes>
  );
}

