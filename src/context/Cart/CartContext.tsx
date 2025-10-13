import {createContext, useContext} from "react"
import type { CartItem } from "../../types/cartItem";
import type { Product } from "../../types/Product";

interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    addItemToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    clearCart: () => void;


}

const CartContext = createContext<CartContextType>({
    cartItems:[],
    totalAmount: 0,
    addItemToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    
})

export { CartContext }

export const useCart = () => {
    const context = useContext(CartContext)
   
    return context
} 
