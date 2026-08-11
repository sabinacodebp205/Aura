import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import AppRoutes from './router';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
