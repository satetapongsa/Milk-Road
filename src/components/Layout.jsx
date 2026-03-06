import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <Header onOpenCart={() => setIsCartOpen(true)} />
            <main>
                <Outlet />
            </main>
            <Footer />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
