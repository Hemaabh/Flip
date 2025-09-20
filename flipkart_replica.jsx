import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FlipKart Replica (educational) - Enhanced with Product Pages, Pagination & Animations
// Single-file React component using Tailwind and Framer Motion.
// Drop into a Create React App / Vite project with Tailwind configured and install framer-motion:
// npm install framer-motion

export default function FlipkartReplica() {
    // CORE UI STATE
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [dark, setDark] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // product page / detail
    const [quickView, setQuickView] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 6;

    // SAMPLE PRODUCTS (more realistic dataset to demo pagination)
    const products = useMemo(
        () => [
            ...Array.from({ length: 20 }).map((_, i) => ({
                id: i + 1,
                title: [`Wireless Headphones`, `Casual Shirt`, `Smart LED TV`, `Running Shoes`, `Blender`, `Bedsheet`][i % 6] + ` — Model ${i + 1}`,
                price: Math.round((500 + Math.random() * 30000) / 50) * 50,
                rating: (3.6 + Math.random() * 1.4).toFixed(1),
                img: `https://picsum.photos/seed/product${i + 1}/800/600`,
                category: ["Electronics", "Clothing", "Electronics", "Footwear", "Home", "Home"][i % 6],
                description:
                    "This is an example product description. It includes features, specs and delivery estimates. Perfect for demoing product pages in the replica.",
            })),
        ],
        []
    );

    const categories = ["All", "Electronics", "Clothing", "Footwear", "Home"];

    // FILTERING
    const filtered = products.filter((p) => {
        const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
        const matchesCat = category === "All" || p.category === category;
        return matchesQuery && matchesCat;
    });

    // PAGINATION SLICES
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function goToPage(n) {
        const clamped = Math.min(Math.max(1, n), totalPages);
        setPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function addToCart(p) {
        setCart((c) => [...c, p]);
    }

    function removeFromCart(id) {
        setCart((c) => c.filter((x, idx) => idx !== id));
    }

    // ANIMATION VARIANTS
    const cardVariant = {
        hidden: { opacity: 0, y: 12, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 },
    };

    const pageTransition = { type: "spring", stiffness: 200, damping: 30 };

    return (
        <div className={dark ? "min-h-screen bg-gray-900 text-gray-100" : "min-h-screen bg-gray-50 text-gray-900"}>
            {/* Top bar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <motion.div layoutId="brand" className="text-2xl font-bold tracking-tight">ShopKart</motion.div>
                        <nav className="hidden md:flex gap-2 items-center ml-4">
                            <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Categories</button>
                            <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Deals</button>
                            <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Orders</button>
                        </nav>
                    </div>

                    <div className="flex-1 max-w-xl">
                        <label className="relative block">
                            <input
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
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
                                    onClick={() => { setCategory(c); setPage(1); }}
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

                {/* Product area / or product page if selected */}
                <section className="md:col-span-3">
                    {/* If a product is selected, show dedicated product page */}
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key={`product-${selectedProduct.id}`}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={pageTransition}
                                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                            >
                                <div className="flex items-start gap-6">
                                    <motion.img layoutId={`img-${selectedProduct.id}`} src={selectedProduct.img} alt="" className="w-80 h-64 object-cover rounded" />

                                    <div className="flex-1">
                                        <motion.h1 layoutId={`title-${selectedProduct.id}`} className="text-2xl font-bold">{selectedProduct.title}</motion.h1>
                                        <div className="mt-2 text-lg font-semibold">₹{selectedProduct.price.toLocaleString()}</div>
                                        <div className="mt-2 text-sm opacity-70">⭐ {selectedProduct.rating} • Category: {selectedProduct.category}</div>

                                        <p className="mt-4 text-sm opacity-80">{selectedProduct.description}</p>

                                        <div className="mt-6 flex gap-3">
                                            <button onClick={() => addToCart(selectedProduct)} className="px-4 py-2 rounded bg-indigo-600 text-white">Add to cart</button>
                                            <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 rounded border">Back to results</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium">Showing {filtered.length} results</div>

                                    <div className="flex items-center gap-3">
                                        <select className="px-2 py-1 rounded border" onChange={(e) => { /* placeholder for sort */ }}>
                                            <option>Sort by: Popular</option>
                                            <option>Price: Low to High</option>
                                            <option>Price: High to Low</option>
                                        </select>
                                    </div>
                                </div>

                                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {paginated.map((p) => (
                                            <motion.article
                                                key={p.id}
                                                layout
                                                variants={cardVariant}
                                                initial="hidden"
                                                animate="show"
                                                exit="hidden"
                                                transition={{ duration: 0.25 }}
                                                className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm flex flex-col cursor-pointer"
                                                onClick={() => setSelectedProduct(p)}
                                            >
                                                <div className="aspect-[4/3] w-full rounded overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                                                    <motion.img layoutId={`img-${p.id}`} src={p.img} alt={p.title} className="object-cover h-full w-full" />
                                                </div>
                                                <div className="mt-3 flex-1 flex flex-col">
                                                    <motion.h3 layoutId={`title-${p.id}`} className="font-semibold text-sm line-clamp-2">{p.title}</motion.h3>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div>
                                                            <div className="text-base font-bold">₹{p.price.toLocaleString()}</div>
                                                            <div className="text-xs opacity-70">⭐ {p.rating}</div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                                                                className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:opacity-90"
                                                            >
                                                                Add
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setQuickView(p); }}
                                                                className="px-3 py-1 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                Quick view
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination controls */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm opacity-80">Page {page} of {totalPages}</div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => goToPage(page - 1)} className="px-3 py-1 rounded border" disabled={page === 1}>Prev</button>

                                        {/* small page selector */}
                                        <div className="hidden sm:flex items-center gap-1">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => goToPage(i + 1)}
                                                    className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-indigo-600 text-white' : 'border hover:bg-gray-50'}`}
                                                >{i + 1}</button>
                                            ))}
                                        </div>

                                        <button onClick={() => goToPage(page + 1)} className="px-3 py-1 rounded border" disabled={page === totalPages}>Next</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            {/* Footer cart drawer (animated with framer) */}
            <motion.div layout className="fixed right-6 bottom-6 z-50">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg w-80">
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
                                <button onClick={() => removeFromCart(i)} className="text-xs px-2 py-1 rounded border">Remove</button>
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
                </motion.div>
            </motion.div>

            {/* Quick view modal with AnimatePresence and transition */}
            <AnimatePresence>
                {quickView && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div layoutId={`card-${quickView.id}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl p-6">
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
                                    <p className="mt-4 text-sm opacity-80">{quickView.description}</p>

                                    <div className="mt-6 flex gap-3">
                                        <button onClick={() => { addToCart(quickView); setQuickView(null); }} className="px-4 py-2 rounded bg-indigo-600 text-white">Add to cart</button>
                                        <button onClick={() => setQuickView(null)} className="px-4 py-2 rounded border">Close</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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