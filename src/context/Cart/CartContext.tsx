import {createContext, useContext} from "react"
import type { CartItem } from "../../types/cartItem";
import type { Product } from "../../types/Product";

interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    addItemToCart: (productId: string) => Promise<void>;
    removeFromCart: (product: Product) => Promise<void>;
    clearCart: () => Promise<void>;
    error: string;
}

const CartContext = createContext<CartContextType>({
    cartItems:[],
    totalAmount: 0,
    addItemToCart: async () => {},
    removeFromCart: async () => {},
    clearCart: async () => {},
    error: '',
})

export { CartContext }

export const useCart = () => {
    const context = useContext(CartContext)
   
    return context
} 
