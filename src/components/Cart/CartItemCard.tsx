import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, memo } from "react";
import type { CartItem } from "../../types/cartItem";
import QuantityControl from "./QuantityControl";

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemove: (productId: string) => void;
}

const CartItemCard = ({ item, onUpdateQuantity, onRemove }: CartItemCardProps) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const itemTotal = item.unitPrice * item.quantity;

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => onRemove(item.productId), 400);
    };

    return (
        <Card
            sx={{
                position: 'relative',
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                p: 3.5,
                transition: 'all 200ms ease',
                opacity: isRemoving ? 0 : 1,
                transform: isRemoving ? 'translateX(-30px) scale(0.95)' : 'translateX(0) scale(1)',
                '&:hover': {
                    borderColor: '#D1D5DB',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Grid Layout */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr auto auto',
                    gap: 3,
                    alignItems: 'center',
                }}
            >
                {/* Product Image */}
                <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                        width: 140,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid #F3F4F6',
                        bgcolor: '#F9FAFB',
                    }}
                />

                {/* Product Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '17px',
                            fontWeight: 500,
                            color: '#111827',
                            lineHeight: 1.4,
                        }}
                    >
                        {item.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '15px',
                            color: '#6B7280',
                            mt: 1,
                        }}
                    >
                        Unit price: ${item.unitPrice.toFixed(2)}
                    </Typography>
                </Box>

                {/* Quantity Control */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <QuantityControl
                        value={item.quantity}
                        max={99}
                        onChange={(newQuantity) => onUpdateQuantity(item.productId, newQuantity)}
                    />
                </Box>

                {/* Item Total & Delete Button */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, minWidth: 100 }}>
                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#111827',
                            fontVariantNumeric: 'tabular-nums',
                            textAlign: 'right',
                        }}
                    >
                        ${itemTotal.toFixed(2)}
                    </Typography>
                    
                    {/* Trash/Delete Button */}
                    <IconButton
                        onClick={handleRemove}
                        aria-label="Remove item from cart"
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            '&:hover': {
                                bgcolor: '#FEE2E2',
                                borderColor: '#FCA5A5',
                                '& .MuiSvgIcon-root': {
                                    color: '#EF4444',
                                },
                            },
                            transition: 'all 200ms ease',
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: 20, color: '#6B7280' }} />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(CartItemCard, (prevProps, nextProps) => {
    return (
        prevProps.item.productId === nextProps.item.productId &&
        prevProps.item.quantity === nextProps.item.quantity &&
        prevProps.item.unitPrice === nextProps.item.unitPrice
    );
});


