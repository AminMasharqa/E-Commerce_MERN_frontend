import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../types/cartItem";
import { 
    calculateSubtotal, 
    calculateShipping, 
    calculateTax, 
    formatPrice 
} from "../../utils/cartHelpers";

interface OrderSummaryProps {
    items: CartItem[];
    onCheckout?: () => void;
    onClearCart: () => void;
    isProcessing?: boolean;
}

const OrderSummary = ({ 
    items, 
    onCheckout, 
    onClearCart,
    isProcessing = false 
}: OrderSummaryProps) => {
    const navigate = useNavigate();
    const subtotal = useMemo(() => calculateSubtotal(items), [items]);
    const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);
    const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
    const total = subtotal + shipping + tax;

    const handleCheckoutClick = () => {
        if (onCheckout) {
            onCheckout();
        } else {
            navigate('/checkout');
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '20px',
                p: 4.5,
                position: 'sticky',
                top: 92,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            }}
        >
            {/* Header */}
            <Typography
                variant="h5"
                sx={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 3.5,
                }}
            >
                Order Summary
            </Typography>

            {/* Summary Breakdown */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Subtotal */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: '#6B7280',
                        }}
                    >
                        Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#111827',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {formatPrice(subtotal)}
                    </Typography>
                </Box>

                {/* Shipping */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            color: '#6B7280',
                        }}
                    >
                        Shipping
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: shipping === 0 ? '#10B981' : '#111827',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </Typography>
                </Box>

                {/* Tax */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: '15px',
                                color: '#6B7280',
                            }}
                        >
                            Tax
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: '12px',
                                color: '#9CA3AF',
                                ml: 0.5,
                            }}
                        >
                            (8.5%)
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#111827',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {formatPrice(tax)}
                    </Typography>
                </Box>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3, borderColor: '#E5E7EB' }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#111827',
                    }}
                >
                    Total
                </Typography>
                <Typography
                    sx={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {formatPrice(total)}
                </Typography>
            </Box>

            {/* Checkout Button */}
            <Button
                onClick={handleCheckoutClick}
                disabled={isProcessing || items.length === 0}
                fullWidth
                sx={{
                    height: 56,
                    background: 'linear-gradient(135deg, #000000 0%, #1F2937 100%)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    borderRadius: '14px',
                    textTransform: 'none',
                    mb: 2.5,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                        background: '#E5E7EB',
                        color: '#9CA3AF',
                    },
                    transition: 'all 200ms ease',
                }}
            >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            {/* Clear Cart Button */}
            <Button
                onClick={onClearCart}
                variant="outlined"
                fullWidth
                sx={{
                    height: 48,
                    borderColor: '#E5E7EB',
                    color: '#EF4444',
                    fontSize: '15px',
                    fontWeight: 500,
                    borderRadius: '12px',
                    textTransform: 'none',
                    mb: 2.5,
                    '&:hover': {
                        borderColor: '#FCA5A5',
                        bgcolor: '#FEE2E2',
                    },
                }}
            >
                Clear Cart
            </Button>

            {/* Trust Indicators */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2.5,
                }}
            >
                <LockIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                <Typography
                    sx={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                    }}
                >
                    Secure checkout
                </Typography>
            </Box>

            {/* Free Shipping Notice */}
            {subtotal > 0 && subtotal < 50 && (
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: '#F0FDF4',
                        borderRadius: '10px',
                        border: '1px solid #BBF7D0',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: '#15803D',
                            textAlign: 'center',
                        }}
                    >
                        Add {formatPrice(50 - subtotal)} more for FREE shipping!
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default OrderSummary;


