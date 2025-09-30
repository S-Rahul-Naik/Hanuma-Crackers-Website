import React, { createContext, useContext, useEffect, useState } from "react";

// Cart item type
export type CartItem = {
	id: string;
	name: string;
	price: number;
	image: string;
	category?: string;
	quantity: number;
};

type CartContextType = {
	cart: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "hanuma_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cart, setCart] = useState<CartItem[]>([]);

	// Load cart from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(CART_STORAGE_KEY);
		if (stored) {
			try {
				setCart(JSON.parse(stored));
			} catch {
				setCart([]);
			}
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}, [cart]);

	const addToCart = (item: CartItem) => {
		setCart(prev => {
			const existing = prev.find(i => i.id === item.id);
			if (existing) {
				return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
			}
			return [...prev, item];
		});
	};

	const removeFromCart = (id: string) => {
		setCart(prev => prev.filter(i => i.id !== id));
	};

	const updateQuantity = (id: string, quantity: number) => {
		setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
	};

	const clearCart = () => setCart([]);

	return (
		<CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within a CartProvider");
	return ctx;
};
