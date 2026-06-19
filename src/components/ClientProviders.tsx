"use client";

import { CartProvider } from "@/context/CartContext";
import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <Cart />
      {children}
    </CartProvider>
  );
}
