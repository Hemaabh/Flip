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