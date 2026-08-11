import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import AppRoutes from './router';

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
