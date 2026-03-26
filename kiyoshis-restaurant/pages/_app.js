import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import AccessibilityWidget from "@/components/acessibilityWidget";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <AccessibilityWidget />
    </CartProvider>
  );
}
