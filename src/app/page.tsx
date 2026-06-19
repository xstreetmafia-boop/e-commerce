"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import AnimatedLogo from "@/components/AnimatedLogo";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch Shopify products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  // Lenis smooth scroll - desktop only (breaks mobile browsers)
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring for parallax
  const smoothProgress = useSpring(heroScrollProgress, { stiffness: 100, damping: 30 });
  
  // Hero stays fixed, content slides over
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.9]);
  const heroBlur = useTransform(heroScrollProgress, [0, 0.5], [0, 10]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsScrolled(latest > 0.05);
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 80 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section - Fixed with parallax */}
      <div ref={heroRef} className="h-[200vh] relative">
        <motion.section 
          style={{ 
            opacity: heroOpacity,
            scale: heroScale,
            filter: useTransform(heroBlur, (v) => `blur(${v}px)`)
          }}
          className="h-screen w-full flex flex-col items-center justify-center px-4 bg-white fixed top-0 left-0 right-0 z-0 overflow-hidden"
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          {/* Floating Orbs */}
          <motion.div
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-green-200 to-green-300 opacity-40 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[30%] right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 opacity-30 blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[25%] left-[20%] w-24 h-24 rounded-full bg-gradient-to-br from-green-300 to-green-400 opacity-20 blur-xl"
          />

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-green-400"
              style={{
                left: `${15 + i * 15}%`,
                bottom: `${10 + i * 5}%`,
              }}
            />
          ))}

          <div className="max-w-7xl mx-auto text-center relative z-10">
            {/* Glowing Ring Behind Text */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-green-400/10 blur-3xl"
            />

            {/* Animated SVG Logo with anime.js drawable effect */}
            <div className="relative">
              <AnimatedLogo className="w-full max-w-4xl mx-auto h-auto drop-shadow-[0_0_40px_rgba(34,197,94,0.4)]" />
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-base sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-light px-2"
            >
              Discover amazing products with exceptional quality and unbeatable prices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 60px rgba(34, 197, 94, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 sm:px-10 sm:py-5 bg-green-500 text-white font-bold rounded-full text-base sm:text-lg hover:bg-green-600 transition-all duration-300 w-full sm:w-auto"
                >
                  Shop Now
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 sm:px-10 sm:py-5 border-2 border-gray-200 text-gray-700 font-bold rounded-full text-base sm:text-lg hover:border-green-500 hover:text-green-600 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-sm text-gray-400 uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>

      {/* Second Section - Slides up over hero with shadow */}
      <motion.section 
        className="relative z-10 bg-white rounded-t-[2rem] sm:rounded-t-[3rem] -mt-[100vh] shadow-[0_-40px_100px_rgba(0,0,0,0.15)]"
      >
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-6" />
        
        <div className="py-16 sm:py-24 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Featured Products */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12 sm:mb-20"
              >
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900">
                  Featured <span className="text-green-500">Products</span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {productsLoading ? (
                  // Loading skeletons
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-3xl mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  ))
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.title,
                        price: parseFloat(product.priceRange.minVariantPrice.amount),
                        image: product.images.edges[0]?.node.url || "",
                        imageAlt: product.images.edges[0]?.node.altText || product.title,
                      }}
                      index={index}
                    />
                  ))
                ) : (
                  // Fallback if no products
                  [
                    { id: "1", name: "Premium Headphones", price: 299, image: "", imageAlt: "" },
                    { id: "2", name: "Smart Watch Pro", price: 199, image: "", imageAlt: "" },
                    { id: "3", name: "Wireless Speaker", price: 149, image: "", imageAlt: "" },
                    { id: "4", name: "Laptop Stand", price: 79, image: "", imageAlt: "" },
                  ].map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))
                )}
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 sm:mt-16 flex justify-center"
            >
              <motion.a
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(37, 211, 102, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full text-base sm:text-lg shadow-lg hover:bg-[#20bd5a] transition-all duration-300"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Marquee Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-green-500 via-green-600 to-green-500 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%)] bg-[length:60px_60px]" />
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-3xl sm:text-5xl md:text-7xl font-black text-white/20 mx-6 sm:mx-12 flex items-center">
              DEMO
            </span>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Products" },
              { number: "50+", label: "Countries" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl sm:text-4xl md:text-6xl font-black text-green-500"
                >
                  {stat.number}
                </motion.div>
                <p className="mt-2 text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 bg-gray-100 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-green-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-green-600/10 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.08)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 bg-green-500/20 text-green-600 rounded-full text-sm font-semibold">
              Customer Reviews
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-black text-gray-900">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Ahmed",
                role: "Verified Buyer",
                review: "Absolutely love the quality! Fast shipping and the product exceeded my expectations. Will definitely order again.",
                rating: 5,
                avatar: "👩"
              },
              {
                name: "Mohammed Ali",
                role: "Verified Buyer",
                review: "Best online shopping experience I've had. The customer service is amazing and prices are unbeatable!",
                rating: 5,
                avatar: "👨"
              },
              {
                name: "Fatima Hassan",
                role: "Verified Buyer",
                review: "Great products, great prices, great service. DEMO has become my go-to store for everything!",
                rating: 5,
                avatar: "👩‍💼"
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white shadow-xl border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-4xl text-green-500/30">
                  "
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                
                {/* Review text */}
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  "{review.review}"
                </p>
                
                {/* Reviewer info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">{review.name}</p>
                    <p className="text-green-600 text-sm">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-gray-600"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">↩️</span>
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-20 px-4 bg-gray-900 border-t border-gray-800 relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
          >
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-4xl text-green-500 inline-block"
                style={{ fontFamily: "var(--font-unbounded), sans-serif", fontWeight: 900 }}
              >
                DEMO
              </motion.span>
              <p className="mt-4 text-gray-400">
                Premium products for the modern lifestyle. Quality you can trust, style you&apos;ll love.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Products", links: ["New Arrivals", "Best Sellers", "Sale", "Collections"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help Center", "Shipping", "Returns", "Contact"] }
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5, color: "#22c55e" }}
                        className="text-gray-400 hover:text-green-500 transition-colors inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-gray-500 text-sm">
              © 2025 DEMO. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["𝕏", "f", "in", "▶"].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all font-bold"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// ProductCard component with Add to Cart functionality
function ProductCard({ product, index }: { product: { id: string; name: string; price: number; image: string; imageAlt: string }; index: number }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -15 }}
      className="group cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.05, rotateY: 5 }}
        transition={{ duration: 0.4 }}
        className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 rounded-3xl mb-4 overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-shadow duration-500 flex items-center justify-center"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <span className="text-6xl">📦</span>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className={`w-full py-2 sm:py-3 text-sm sm:text-base font-bold rounded-xl transition-all ${
              isAdded 
                ? "bg-green-600 text-white" 
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isAdded ? "✓ Added!" : "Add to Cart"}
          </motion.button>
        </div>
      </motion.div>
      <h3 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors truncate">
        {product.name}
      </h3>
      <p className="text-green-600 font-bold mt-1 text-base sm:text-xl">
        ${product.price}
      </p>
    </motion.div>
  );
}
