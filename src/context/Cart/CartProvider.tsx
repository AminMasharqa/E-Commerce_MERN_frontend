// src/context/Auth/AuthProvider.ts

import type { FC, PropsWithChildren } from 'react'
import {  useState } from 'react'
import { CartContext } from './CartContext'
import type { CartItem } from '../../types/cartItem';
import type { Product } from '../../types/Product';

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const addItemToCart = (product: Product) => {
        console.log('Adding item to cart', product);
        // setCartItems([...cartItems, product]);
        setTotalAmount(totalAmount + product.price);
    }
    const removeFromCart = (product: Product) => {
        //  setCartItems(cartItems.filter(item => item.id !== product._id));
    }

    const clearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
    }


    return <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>
} 

export default CartProvider





