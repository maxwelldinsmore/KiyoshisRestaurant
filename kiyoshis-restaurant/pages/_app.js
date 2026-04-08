import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import AccessibilityWidget from "@/components/acessibilityWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <AuthProvider>
          
        <Component {...pageProps} />
        <AccessibilityWidget />
      </AuthProvider>
    </CartProvider>
  );
}
