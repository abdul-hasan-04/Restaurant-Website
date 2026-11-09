import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import ThemePrvider from "./context/ThemeContext.jsx";
// CURRENT FONT FAMILY
import "@fontsource/plus-jakarta-sans";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import AuthProvider from "./context/AuthContext.jsx";
import CartProvider from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
    <ThemePrvider>
      <AuthProvider>
        <CartProvider>
        <BrowserRouter>
          <App />
          <ToastContainer
            autoClose={2000}
            closeOnClick
            pauseOnHover
            theme="light"
            hideProgressBar
            toastClassName="restaurant-toast"
            progressClassName="restaurant-toast-progress"
          />
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemePrvider>
);