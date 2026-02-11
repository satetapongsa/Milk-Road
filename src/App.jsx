import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import QuotationRequest from './pages/QuotationRequest';
import Quotation from './pages/Quotation';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="receipt" element={<Receipt />} />
            <Route path="quotation-request" element={<QuotationRequest />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order/:id" element={<Receipt />} />
            <Route path="product/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
