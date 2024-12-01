
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Adopt from './pages/Adopt';
import AdminPanel from './pages/AdminPanel';
import PetDetail from './pages/PetDetail';
import UserProfile from './pages/UserProfile';
import AboutUs from './pages/AboutUs';
import DonatePage from './pages/Donate';
import StorePage from './pages/Store';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/car';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/adopt" element={<Adopt />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/adopt/pet-detail/:id" element={<PetDetail />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/store/product-detail/:idproducto" element={<ProductDetailPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            </Routes>
        </Router>
    );
}

export default App;
