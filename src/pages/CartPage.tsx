import { 
    Box, 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    CardMedia, 
    Button, 
    IconButton,
    Divider,
    Paper,
    Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/Cart/CartContext";
import type { CartItem } from "../types/cartItem";

const CartPage = () => {
    const { cartItems, totalAmount, removeFromCart, clearCart, error } = useCart();
    const navigate = useNavigate();

    // Handle remove item - we need to convert CartItem to Product format for removeFromCart
    const handleRemoveItem = (item: CartItem) => {
        removeFromCart({
            _id: item.productId,
            title: item.title,
            image: item.image,
            price: item.unitPrice,
            stock: 0 // Not needed for removal
        });
    };

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center"
                    minHeight="60vh"
                >
                    <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Your Cart is Empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Add some products to get started!
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                    My Shopping Cart
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                >
                    Continue Shopping
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3
                }}
            >
                {/* Cart Items Section */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66%' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {cartItems.map((item) => (
                            <Card 
                                key={item.productId} 
                                sx={{ 
                                    display: 'flex', 
                                    position: 'relative',
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #d0d0d0'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ 
                                        width: 150, 
                                        height: 150,
                                        objectFit: 'cover'
                                    }}
                                    image={item.image}
                                    alt={item.title}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography variant="h6" component="div">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Price: ${item.unitPrice.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity: {item.quantity}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                            Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1 }}>
                                    <IconButton 
                                        aria-label="delete"
                                        onClick={() => handleRemoveItem(item)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Order Summary Section */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
                    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h5" gutterBottom>
                            Order Summary
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body1">
                                    Items ({cartItems.length})
                                </Typography>
                                <Typography variant="body1">
                                    ${totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Typography variant="h6">
                                Total
                            </Typography>
                            <Typography variant="h6" color="primary">
                                ${totalAmount.toFixed(2)}
                            </Typography>
                        </Box>

                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            sx={{ mb: 2 }}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button 
                            variant="outlined" 
                            fullWidth
                            color="error"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default CartPage;