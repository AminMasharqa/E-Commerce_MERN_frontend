# Shopping Cart Implementation Documentation

## Overview

This is a comprehensive shopping cart implementation adapted from a detailed design specification, built with Material-UI (MUI) and TypeScript. The cart follows modern design principles with clean aesthetics, smooth animations, and professional user experience.

## Tech Stack

- **React** 19.1.1
- **TypeScript** 5.8.3
- **Material-UI (MUI)** 7.3.2
- **React Router DOM** 7.8.2

## Architecture

### Components Structure

```
src/
├── components/
│   └── Cart/
│       ├── QuantityControl.tsx      # Quantity selector with +/- buttons
│       ├── CartItemCard.tsx         # Individual cart item display
│       └── OrderSummary.tsx         # Order totals and checkout
├── pages/
│   └── CartPage.tsx                 # Main cart page container
├── utils/
│   └── cartHelpers.ts               # Price calculations and formatting
├── context/
│   └── Cart/
│       ├── CartContext.tsx          # Cart context definition
│       └── CartProvider.tsx         # Cart state management
└── theme/
    └── cartTheme.ts                 # Design system constants
```

## Design System

### Color Palette

**Background & Surface**
- Background: `#FAFAFA` (off-white, reduced eye strain)
- Surface/Cards: `#FFFFFF` (pure white)
- Primary Action: `#000000` (black for CTAs)

**Text Colors**
- Primary: `#111827` (near black)
- Secondary: `#6B7280` (medium gray)
- Muted: `#9CA3AF` (light gray)

**Feedback Colors**
- Success: `#10B981` (green)
- Error: `#EF4444` (red)
- Warning: `#F59E0B` (amber)

### Typography

- **Page Title**: 36px, 700 weight, -0.03em letter-spacing
- **Section Headers**: 24px, 600 weight
- **Product Name**: 17px, 500 weight
- **Body Text**: 15px, 400 weight
- **Small Text**: 13px, 400 weight
- **Price (Total)**: 28px, 600 weight
- **Price (Regular)**: 17px, 500 weight

### Spacing System

Uses 8px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius

- Small: 10px
- Medium: 12px
- Large: 16px
- XL: 20px

## Components

### 1. QuantityControl

**Location**: `src/components/Cart/QuantityControl.tsx`

**Features**:
- Plus/minus buttons with proper disabled states
- Animated number on change (scale animation)
- Min/max validation
- Accessible with proper ARIA labels
- Touch-friendly 44px click targets

**Props**:
```typescript
interface QuantityControlProps {
    value: number;
    min?: number;        // Default: 1
    max?: number;        // Default: 99
    onChange: (newValue: number) => void;
}
```

### 2. CartItemCard

**Location**: `src/components/Cart/CartItemCard.tsx`

**Features**:
- Grid layout: Image (140px) | Info | Quantity | Total
- Hover effect: lift with shadow
- Remove button: positioned top-right
- Smooth remove animation (fade + translate)
- Memoized for performance

**Props**:
```typescript
interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemove: (item: CartItem) => void;
}
```

**Animations**:
- Hover: `translateY(-2px)` + enhanced shadow
- Remove: `opacity 0` + `translateX(-30px)` over 400ms

### 3. OrderSummary

**Location**: `src/components/Cart/OrderSummary.tsx`

**Features**:
- Sticky positioning (stays visible on scroll)
- Detailed price breakdown:
  - Subtotal with item count
  - Shipping (free over $50)
  - Tax (8.5%)
  - Total
- Checkout button with gradient
- Clear cart button
- Trust indicators (lock icon + "Secure checkout")
- Free shipping progress indicator

**Props**:
```typescript
interface OrderSummaryProps {
    items: CartItem[];
    onCheckout: () => void;
    onClearCart: () => void;
    isProcessing?: boolean;
}
```

**Calculations**:
- Free shipping threshold: $50
- Standard shipping: $5.99
- Tax rate: 8.5%

### 4. CartPage

**Location**: `src/pages/CartPage.tsx`

**Features**:
- Two-column layout (65% items, 35% summary)
- Responsive (stacks on mobile)
- Page header with title and "Continue Shopping" link
- Item count badge
- Empty state with icon and CTA
- Error handling with alerts

**Layout**:
- Max width: 1400px, centered
- Container padding: 60px horizontal, 80px vertical
- Column gap: 48px
- Background: `#FAFAFA`

## Utilities

### Cart Helpers

**Location**: `src/utils/cartHelpers.ts`

**Functions**:

```typescript
// Calculate subtotal from cart items
calculateSubtotal(items: CartItem[]): number

// Calculate shipping cost (free over $50)
calculateShipping(subtotal: number): number

// Calculate tax (8.5% by default)
calculateTax(subtotal: number, taxRate?: number): number

// Calculate final total
calculateTotal(items: CartItem[]): number

// Format price as USD currency
formatPrice(amount: number): string
```

## Animations & Interactions

### Micro-animations

1. **Quantity Change**
   - Number scales to 1.2x for 150ms
   - Smooth transition back

2. **Item Removal**
   - Fade opacity to 0
   - Translate left -30px
   - Scale down to 0.95
   - Duration: 400ms cubic-bezier

3. **Card Hover**
   - Lift up 2px
   - Enhanced shadow
   - Border color change
   - 200ms ease transition

4. **Button Interactions**
   - Hover: background color change
   - Active: scale(0.95)
   - Disabled: reduced opacity

### Performance Optimizations

1. **Memoization**
   - CartItemCard uses `React.memo`
   - Price calculations use `useMemo`
   - Callbacks use `useCallback`

2. **Conditional Rendering**
   - Empty state vs. cart items
   - Error alerts only when needed

## State Management

### Cart Context

**Location**: `src/context/Cart/CartContext.tsx`

**Interface**:
```typescript
interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    addItemToCart: (productId: string) => Promise<void>;
    removeFromCart: (product: Product) => Promise<void>;
    clearCart: () => Promise<void>;
    error: string;
}
```

### Cart Item Type

**Location**: `src/types/cartItem.ts`

```typescript
interface CartItem {
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    image: string;
}
```

## Accessibility

### Keyboard Navigation
- Tab order: logical flow
- Focus indicators: visible and clear
- Enter/Space: activate buttons
- Escape: close modals (future)

### ARIA Labels
- Quantity controls: "Increase/Decrease quantity"
- Remove buttons: "Remove item"
- Descriptive alt text for images

### Screen Reader Support
- Semantic HTML
- Proper heading hierarchy
- Status announcements for cart updates

## Future Enhancements

### Quantity Update Backend Integration

Currently, quantity changes are logged to console. To implement:

```typescript
// In CartContext, add:
updateQuantity: (productId: string, quantity: number) => Promise<void>;

// Implementation:
const updateQuantity = async (productId: string, quantity: number) => {
    const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity })
    });
    // Update state...
};
```

### Checkout Flow

```typescript
const handleCheckout = () => {
    navigate('/checkout');
    // Or open checkout modal
};
```

### Promo Code Support

Add to OrderSummary:
- Input field for promo code
- Apply/Remove functionality
- Discount calculation
- Success/error feedback

### Saved for Later

- Move items to "saved" list
- Restore from saved list
- Persistent storage

### Product Variants

Support for:
- Size selection
- Color options
- SKU tracking

## Testing Recommendations

### Unit Tests
- [ ] Cart calculations (subtotal, tax, shipping)
- [ ] Quantity validation
- [ ] Price formatting

### Integration Tests
- [ ] Add/remove items flow
- [ ] Quantity updates
- [ ] Clear cart functionality

### E2E Tests
- [ ] Complete user journey
- [ ] Empty cart state
- [ ] Error scenarios
- [ ] Responsive behavior

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment Notes

1. **Environment Variables**
   - Ensure `BASE_URL` is configured correctly
   - API endpoints must support CORS

2. **Performance**
   - Images should be optimized
   - Consider lazy loading for large carts
   - Enable compression

3. **SEO**
   - Cart page should be client-side only
   - No need for server-side rendering

## Troubleshooting

### Issue: Quantity not updating
- Check if `updateQuantity` is implemented in CartContext
- Verify API endpoint is correct
- Check network tab for errors

### Issue: Prices not displaying correctly
- Ensure all prices are numbers, not strings
- Check `formatPrice` function
- Verify currency locale settings

### Issue: Animations not smooth
- Check if animations are disabled in OS settings
- Verify CSS transitions are not overridden
- Test on different browsers

## Credits

Design adapted from comprehensive shopping cart specification.
Implementation by adapting to Material-UI and TypeScript stack.


