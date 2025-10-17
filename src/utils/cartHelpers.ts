import type { CartItem } from "../types/cartItem";

export const calculateSubtotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        return total + (item.unitPrice * item.quantity);
    }, 0);
};

export const calculateShipping = (subtotal: number): number => {
    const FREE_SHIPPING_THRESHOLD = 50;
    const STANDARD_SHIPPING = 5.99;
    
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
};

export const calculateTax = (subtotal: number, taxRate: number = 0.085): number => {
    return subtotal * taxRate;
};

export const calculateTotal = (items: CartItem[]): number => {
    const subtotal = calculateSubtotal(items);
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    
    return subtotal + shipping + tax;
};

export const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};


