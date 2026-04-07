import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import AccessibilityWidget from "@/components/acessibilityWidget";
import { AuthProvider } from "@/contexts/AuthContext";

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
