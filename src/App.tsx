import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Features } from "./pages/Features";
import { Docs } from "./pages/Docs";
import { Shop } from "./pages/Shop";
import { Dashboard } from "./pages/Dashboard";
import { Status } from "./pages/Status";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Bot } from "./pages/Bot";
import { OrderPage } from "./pages/OrderPage";
import { Admin } from "./pages/Admin";
import { AdminUser } from "./pages/AdminUser";
import { Challenge } from "./pages/Challenge";

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/status" element={<Status />} />
              <Route path="/login" element={<Login />} />
              <Route path="/bot" element={<Bot />} />
              <Route path="/challenge" element={<Challenge />} />
              {/* <Route path="/checkout" element={<Checkout />} /> 👈 حذف شد */}
              <Route path="/order/:token" element={<OrderPage />} />
              <Route path="/this-is-safe" element={<Admin />} />
              <Route path="/this-is-safe/user/:id" element={<AdminUser />} />
              <Route path="/admin" element={<NotFound />} />
              <Route path="/admin/*" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}
