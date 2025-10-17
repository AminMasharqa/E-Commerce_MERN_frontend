import {createContext, useContext} from "react"
import type { CartItem } from "../../types/cartItem";

interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    addItemToCart: (productId: string) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    error: string;
}

const CartContext = createContext<CartContextType>({
    cartItems:[],
    totalAmount: 0,
    addItemToCart: async () => {},
    updateItemQuantity: async () => {},
    removeFromCart: async () => {},
    clearCart: async () => {},
    error: '',
})

export { CartContext }

export const useCart = () => {
    const context = useContext(CartContext)
   
    return context
} 
