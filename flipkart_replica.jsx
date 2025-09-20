import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const products = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 1000).toFixed(2),
    image: `https://via.placeholder.com/200x200?text=Product+${i + 1}`,
    description: `This is the description for Product ${i + 1}. It’s a high quality item you’ll love!`
}));

export default function FlipkartReplica() {
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [visibleProducts, setVisibleProducts] = useState(6);
    const loader = useRef(null);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item, idx) => idx !== id));
    };

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleProducts((prev) =>
                        prev + 6 <= products.length ? prev + 6 : prev
                    );
                }
            },
            { threshold: 1 }
        );

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Header */}
            <header className="flex items-center justify-between bg-blue-600 p-4 text-white">
                <h1 className="text-xl font-bold">Flipkart Replica</h1>
                <input
                    type="text"
                    placeholder="Search for products"
                    className="rounded px-2 py-1 text-black"
                />
            </header>

            <main className="flex">
                {/* Sidebar */}
                <aside className="hidden w-1/5 bg-gray-200 p-4 dark:bg-gray-800 md:block">
                    <h2 className="mb-2 font-bold">Categories</h2>
                    <ul>
                        <li>Electronics</li>
                        <li>Fashion</li>
                        <li>Home</li>
                        <li>Appliances</li>
                    </ul>
                </aside>

                {/* Content */}
                <section className="flex-1 p-4">
                    {/* Product detail page */}
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.4 }}
                                className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                            >
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="mb-4 rounded bg-blue-600 px-3 py-1 text-white"
                                >
                                    ← Back
                                </button>
                                <div className="flex flex-col md:flex-row">
                                    <motion.img
                                        layoutId={`image-${selectedProduct.id}`}
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full rounded-md md:w-1/2"
                                    />
                                    <div className="p-4">
                                        <motion.h2
                                            layoutId={`title-${selectedProduct.id}`}
                                            className="text-2xl font-bold"
                                        >
                                            {selectedProduct.name}
                                        </motion.h2>
                                        <p className="text-lg font-semibold text-green-600">
                                            ${selectedProduct.price}
                                        </p>
                                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                                            {selectedProduct.description}
                                        </p>
                                        <button
                                            onClick={() => addToCart(selectedProduct)}
                                            className="mt-4 rounded bg-blue-600 px-3 py-1 text-white"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {products.slice(0, visibleProducts).map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="cursor-pointer rounded-lg bg-white p-4 shadow hover:shadow-lg dark:bg-gray-800"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <motion.img
                                            layoutId={`image-${product.id}`}
                                            src={product.image}
                                            alt={product.name}
                                            className="mb-2 h-40 w-full object-cover rounded"
                                        />
                                        <motion.h3 layoutId={`title-${product.id}`} className="font-bold">
                                            {product.name}
                                        </motion.h3>
                                        <p className="text-green-600">${product.price}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            className="mt-2 rounded bg-blue-600 px-3 py-1 text-white"
                                        >
                                            Add to Cart
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loader trigger for infinite scroll */}
                    {!selectedProduct && visibleProducts < products.length && (
                        <div ref={loader} className="mt-4 h-10 w-full text-center text-gray-500">
                            Loading more...
                        </div>
                    )}
                </section>

                {/* Cart */}
                <aside className="w-1/4 bg-gray-100 p-4 dark:bg-gray-700">
                    <h2 className="mb-2 font-bold">Cart</h2>
                    {cart.length === 0 && <p>No items in cart</p>}
                    {cart.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="mb-2 rounded bg-white p-2 shadow dark:bg-gray-800"
                        >
                            <p>{item.name}</p>
                            <p className="text-green-600">${item.price}</p>
                            <button
                                onClick={() => removeFromCart(idx)}
                                className="mt-1 rounded bg-red-600 px-2 py-1 text-white"
                            >
                                Remove
                            </button>
                        </motion.div>
                    ))}
                    {cart.length > 0 && (
                        <p className="mt-2 font-bold">
                            Total: ${cart.reduce((a, c) => a + parseFloat(c.price), 0).toFixed(2)}
                        </p>
                    )}
                </aside>
            </main>
        </div>
    );
}
import React, { useState } from "react";

// FlipKart Replica (educational) - Single-file React component
// Uses Tailwind CSS classes for styling. Drop this file into a Create React App / Vite project
// that already has Tailwind configured. This is intentionally generic and avoids using
// Flipkart branding (logo/text) — it's a layout & feature replica for learning purposes.

export default function FlipkartReplica() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [dark, setDark] = useState(false);
  const [quickView, setQuickView] = useState(null);

  const products = [
    {
      id: 1,
      title: "Wireless Bluetooth Headphones",
      price: 1999,
      rating: 4.3,
      img: "https://images.unsplash.com/photo-1518444021062-4f077f9f0d56?w=800&q=80&auto=format&fit=crop&crop=faces",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Men's Casual Shirt",
      price: 899,
      rating: 4.1,
      img: "https://images.unsplash.com/photo-1520975916134-9a4be19d0c0e?w=800&q=80&auto=format&fit=crop&crop=faces",
      category: "Clothing",
    },
    {
      id: 3,
      title: "Smart LED TV 43 inch",
      price: 25999,
      rating: 4.6,
      img: "https://images.unsplash.com/photo-1585386959984-a4155226c0f6?w=800&q=80&auto=format&fit=crop&crop=entropy",
      category: "Electronics",
    },
    {
      id: 4,
      title: "Women's Running Shoes",
      price: 2499,
      rating: 4.2,
      img: "https://images.unsplash.com/photo-1528701800489-4765f6c5b3c0?w=800&q=80&auto=format&fit=crop&crop=faces",
      category: "Footwear",
    },
    {
      id: 5,
      title: "Blender & Mixer",
      price: 3999,
      rating: 4.0,
      img: "https://images.unsplash.com/photo-1580913421542-0f6de4c2b5f3?w=800&q=80&auto=format&fit=crop&crop=entropy",
      category: "Home",
    },
    {
      id: 6,
      title: "Cotton Bedsheet - King",
      price: 1599,
      rating: 4.4,
      img: "https://images.unsplash.com/photo-1505691723518-36a4f35d0a3b?w=800&q=80&auto=format&fit=crop&crop=entropy",
      category: "Home",
    },
  ];

  const categories = ["All", "Electronics", "Clothing", "Footwear", "Home"];

  const filtered = products.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "All" || p.category === category;
    return matchesQuery && matchesCat;
  });

  function addToCart(p) {
    setCart((c) => [...c, p]);
  }

  function removeFromCart(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }

  return (
    <div className={dark ? "min-h-screen bg-gray-900 text-gray-100" : "min-h-screen bg-gray-50 text-gray-900"}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold tracking-tight">ShopKart</div>
            <nav className="hidden md:flex gap-2 items-center ml-4">
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Categories</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Deals</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Cart</button>
            </nav>
          </div>

          <div className="flex-1 max-w-xl">
            <label className="relative block">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full rounded-md border-gray-200 shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-60">⌘K</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {dark ? "Light" : "Dark"}
            </button>

            <button className="relative px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18l-1 14H4L3 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full text-xs px-1">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setCategory(c)}
                  className={`w-full text-left px-3 py-2 rounded ${category === c ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h4 className="font-semibold">Filters</h4>
            <div className="mt-3 text-sm opacity-80">Price, ratings and more can go here — this is a starting point.</div>
          </div>
        </aside>

        {/* Product area */}
        <section className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">Showing {filtered.length} results</div>
            <div className="flex items-center gap-3">
              <select className="px-2 py-1 rounded border">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm flex flex-col">
                <div className="aspect-[4/3] w-full rounded overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                  <img src={p.img} alt={p.title} className="object-cover h-full w-full" />
                </div>
                <div className="mt-3 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm line-clamp-2">{p.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold">₹{p.price.toLocaleString()}</div>
                      <div className="text-xs opacity-70">⭐ {p.rating}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => addToCart(p)}
                        className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:opacity-90"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setQuickView(p)}
                        className="px-3 py-1 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Quick view
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer cart drawer (simple) */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg w-80">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Cart</div>
            <div className="text-sm opacity-70">{cart.length} items</div>
          </div>

          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {cart.length === 0 && <div className="text-sm opacity-70">Your cart is empty</div>}
            {cart.map((cItem, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={cItem.img} alt="" className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 text-sm">
                  <div className="font-medium line-clamp-1">{cItem.title}</div>
                  <div className="text-xs opacity-70">₹{cItem.price}</div>
                </div>
                <button onClick={() => removeFromCart(cItem.id)} className="text-xs px-2 py-1 rounded border">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-bold">₹{cart.reduce((s, i) => s + i.price, 0).toLocaleString()}</div>
          </div>

          <div className="mt-3">
            <button className="w-full py-2 rounded bg-green-600 text-white font-medium">Checkout</button>
          </div>
        </div>
      </div>

      {/* Quick view modal */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-xl">{quickView.title}</h2>
                <div className="text-sm opacity-70 mt-1">Category: {quickView.category}</div>
              </div>
              <button onClick={() => setQuickView(null)} className="text-sm px-2 py-1 rounded border">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src={quickView.img} alt="" className="w-full h-64 object-cover rounded" />
              <div>
                <div className="font-bold text-2xl">₹{quickView.price.toLocaleString()}</div>
                <div className="mt-2">⭐ {quickView.rating}</div>
                <p className="mt-4 text-sm opacity-80">This is a short product description. You can expand this with features, specifications, and delivery info to make it feel closer to a real product page.</p>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => { addToCart(quickView); setQuickView(null); }} className="px-4 py-2 rounded bg-indigo-600 text-white">Add to cart</button>
                  <button onClick={() => setQuickView(null)} className="px-4 py-2 rounded border">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* small accessibility helper */}
      <style>
        {`/* tailwind "line-clamp" plugin not required; simple fallback for clarity */
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .line-clamp-1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        `}
      </style>
    </div>
  );
}