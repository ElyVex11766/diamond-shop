import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartSidebar } from "./CartSidebar";
import { useCart } from "../context/CartContext";

export function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isLoginPage && <Navbar onCartClick={() => setIsCartOpen(true)} />}
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {!isLoginPage && <Footer />}

      {/* سبد خرید */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
