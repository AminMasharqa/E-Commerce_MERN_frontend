// Design System Constants for Shopping Cart
// Based on the comprehensive design specification

export const CartColors = {
    // Background
    background: '#FAFAFA',
    surface: '#FFFFFF',
    
    // Primary Actions
    primaryAction: '#000000',
    primaryActionHover: '#1F2937',
    secondaryAction: '#FFFFFF',
    secondaryBorder: '#E5E7EB',
    
    // Text Colors
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textLink: '#000000',
    
    // Feedback Colors
    success: '#10B981',
    successLight: '#F0FDF4',
    successBorder: '#BBF7D0',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorBorder: '#FCA5A5',
    warning: '#F59E0B',
    
    // UI Elements
    border: '#E5E7EB',
    borderHover: '#D1D5DB',
    hoverOverlay: 'rgba(0, 0, 0, 0.04)',
    activeOverlay: 'rgba(0, 0, 0, 0.08)',
    focus: '#3B82F6',
    
    // Backgrounds
    bgGray: '#F9FAFB',
    bgGrayLight: '#F3F4F6',
} as const;

export const CartSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

export const CartTypography = {
    pageTitle: {
        fontSize: '36px',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1.2,
    },
    sectionHeader: {
        fontSize: '24px',
        fontWeight: 600,
        lineHeight: 1.3,
    },
    productName: {
        fontSize: '17px',
        fontWeight: 500,
        lineHeight: 1.4,
    },
    body: {
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    small: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    priceTotal: {
        fontSize: '28px',
        fontWeight: 600,
    },
    priceRegular: {
        fontSize: '17px',
        fontWeight: 500,
    },
} as const;

export const CartBorderRadius = {
    small: '10px',
    medium: '12px',
    large: '16px',
    xl: '20px',
} as const;

export const CartShadows = {
    card: '0 4px 16px rgba(0, 0, 0, 0.06)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.08)',
    button: '0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

export const CartTransitions = {
    fast: 'all 150ms ease',
    normal: 'all 200ms ease',
    slow: 'all 300ms ease',
    remove: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;


