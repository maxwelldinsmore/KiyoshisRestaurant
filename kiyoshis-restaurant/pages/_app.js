import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
