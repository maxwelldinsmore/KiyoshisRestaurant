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
              <Head>
                <title>Sushi Bai Kiyoshi</title>
                <meta
                  name="description"
                  content="Order sushi pickup from Sushi Bai Kiyoshi in downtown Toronto. View menu highlights, opening hours, and contact details in one place."
                />
              </Head>
        
              <Header />
        <Component {...pageProps} />
        <Footer />
        <AccessibilityWidget />
      </AuthProvider>
    </CartProvider>
  );
}
