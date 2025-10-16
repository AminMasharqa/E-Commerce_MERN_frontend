// src/context/Cart/CartProvider.tsx

import type { FC, PropsWithChildren } from 'react'
import { useState, useEffect } from 'react'
import { CartContext } from './CartContext'
import type { CartItem } from '../../types/cartItem';
import type { Product } from '../../types/Product';
import { BASE_URL } from '../../constants/baseUrl';
import { useAuth } from '../Auth/AuthContext';

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();

    const addItemToCart = async (productId: string) => {
        try {
            setError(''); // Clear previous errors
            console.log('Adding item to cart', productId);
            
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`${BASE_URL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({productId, quantity: 1})
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add item to cart');
                return;
            }
            
            const cart = await response.json();
            if (!cart) {
                setError('Failed to parse cart response');
                return;
            }
            
            // Map the cart items from the backend response
            const cartItemsMapped = cart.items.map((item: any) => ({
                productId: item.productId._id,
                title: item.productId.title,
                image: item.productId.image,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            }));
            
            setCartItems(cartItemsMapped); 
            setTotalAmount(cart.totalAmount);

        } catch (error) {
            console.error('Error adding item to cart', error);
            setError('Network error occurred');
        }
    }
    const removeFromCart = async (product: Product) => {
        try {
            setError(''); // Clear previous errors
            
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`${BASE_URL}/cart/items/${product._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to remove item from cart');
                return;
            }
            
            const cart = await response.json();
            
            // Map the updated cart items
            const cartItemsMapped = cart.items.map((item: any) => ({
                productId: item.productId._id,
                title: item.productId.title,
                image: item.productId.image,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            }));
            
            setCartItems(cartItemsMapped);
            setTotalAmount(cart.totalAmount);

        } catch (error) {
            console.error('Error removing item from cart', error);
            setError('Network error occurred');
        }
    }

    const clearCart = async () => {
        try {
            setError(''); // Clear previous errors
            
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`${BASE_URL}/cart`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to clear cart');
                return;
            }
            
            setCartItems([]);
            setTotalAmount(0);

        } catch (error) {
            console.error('Error clearing cart', error);
            setError('Network error occurred');
        }
    }
    // Load cart on component mount if user is authenticated
    useEffect(() => {
        const loadCart = async () => {
            if (!token) return;
            
            try {
                const response = await fetch(`${BASE_URL}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const cart = await response.json();
                    const cartItemsMapped = cart.items.map((item: any) => ({
                        productId: item.productId._id,
                        title: item.productId.title,
                        image: item.productId.image,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    }));
                    setCartItems(cartItemsMapped);
                    setTotalAmount(cart.totalAmount);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };
        
        loadCart();
    }, [token]);

    return (
        <CartContext.Provider 
            value={{ 
                cartItems, 
                totalAmount, 
                addItemToCart, 
                removeFromCart, 
                clearCart,
                error 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

