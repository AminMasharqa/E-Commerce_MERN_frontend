import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Alert,
    Badge,
} from "@mui/material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/Cart/CartContext";
import CartItemCard from "../components/Cart/CartItemCard";
import OrderSummary from "../components/Cart/OrderSummary";

const CartPage = () => {
    const { cartItems, updateItemQuantity, removeFromCart, clearCart, error } = useCart();
    const navigate = useNavigate();

    // Handle remove item
    const handleRemoveItem = async (productId: string) => {
        await removeFromCart(productId);
    };

    // Handle quantity update with backend integration
    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        await updateItemQuantity(productId, newQuantity);
    };

    const handleCheckout = () => {
        // TODO: Implement checkout flow
        console.log('Proceed to checkout');
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        maxWidth: '1400px !important',
                        px: { xs: 3, md: 7.5 },
                        py: { xs: 5, md: 10 },
                    }}
                >
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '60vh',
                            textAlign: 'center',
                        }}
                    >
                        <ShoppingBagIcon 
                            sx={{ 
                                fontSize: 160, 
                                color: '#E5E7EB',
                                mb: 2.5,
                            }} 
                        />
                        <Typography 
                            sx={{
                                fontSize: '32px',
                                fontWeight: 600,
                                color: '#111827',
                                mb: 2,
                            }}
                        >
                            Your cart is empty
                        </Typography>
                        <Typography 
                            sx={{
                                fontSize: '16px',
                                color: '#6B7280',
                                mb: 4,
                            }}
                        >
                            Looks like you haven't added anything yet
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{
                                width: 180,
                                height: 48,
                                borderColor: '#E5E7EB',
                                color: '#111827',
                                fontSize: '15px',
                                fontWeight: 500,
                                borderRadius: '12px',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#D1D5DB',
                                    bgcolor: '#F9FAFB',
                                },
                            }}
                        >
                            Start Shopping
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', pb: 8 }}>
            <Container 
                maxWidth="xl" 
                sx={{ 
                    maxWidth: '1400px !important',
                    px: { xs: 3, md: 7.5 },
                    py: { xs: 5, md: 10 },
                }}
            >
                {/* Page Header */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 5,
                    }}
                >
                    <Typography 
                        sx={{
                            fontSize: '36px',
                            fontWeight: 700,
                            color: '#111827',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.2,
                        }}
                    >
                        Shopping Cart
                    </Typography>
                    <Button 
                        variant="text"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#111827',
                            fontSize: '15px',
                            fontWeight: 500,
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'transparent',
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Continue Shopping
                    </Button>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: '12px',
                        }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Main Layout */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 6,
                    }}
                >
                    {/* Cart Items Section */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 65%' } }}>
                        {/* Section Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Typography 
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#111827',
                                }}
                            >
                                Cart Items
                            </Typography>
                            <Badge 
                                badgeContent={cartItems.length}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: '#F3F4F6',
                                        color: '#111827',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        height: 24,
                                        minWidth: 24,
                                        borderRadius: '12px',
                                    }
                                }}
                            />
                        </Box>

                        {/* Cart Items */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {cartItems.map((item) => (
                                <CartItemCard
                                    key={item.productId}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Order Summary Section */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' } }}>
                        <OrderSummary
                            items={cartItems}
                            onCheckout={handleCheckout}
                            onClearCart={clearCart}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CartPage;