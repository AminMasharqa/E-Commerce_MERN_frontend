import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;
    const message = location.state?.message || 'Order placed successfully!';

    useEffect(() => {
        // Clear cart items from localStorage or handle cleanup if needed
        // This is already handled by clearCart() before navigation
    }, []);

    return (
        <Box 
            sx={{ 
                bgcolor: '#FAFAFA', 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        bgcolor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '24px',
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {/* Success Icon with Animation */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 4,
                            border: '3px solid #10B981',
                            animation: 'scaleIn 0.5s ease-out',
                            '@keyframes scaleIn': {
                                '0%': {
                                    transform: 'scale(0)',
                                    opacity: 0,
                                },
                                '50%': {
                                    transform: 'scale(1.1)',
                                },
                                '100%': {
                                    transform: 'scale(1)',
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 80,
                                color: '#10B981',
                            }}
                        />
                    </Box>

                    {/* Success Message */}
                    <Typography
                        sx={{
                            fontSize: '36px',
                            fontWeight: 700,
                            color: '#111827',
                            mb: 2,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Order Placed Successfully!
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '18px',
                            color: '#6B7280',
                            mb: 1,
                            lineHeight: 1.6,
                        }}
                    >
                        Thank you for your purchase! 🎉
                    </Typography>

                    {orderData && (
                        <Typography
                            sx={{
                                fontSize: '16px',
                                color: '#6B7280',
                                mb: 2,
                                lineHeight: 1.6,
                                fontWeight: 500,
                            }}
                        >
                            Order ID: #{orderData._id?.slice(-8).toUpperCase() || 'N/A'}
                        </Typography>
                    )}

                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: '#9CA3AF',
                            mb: 5,
                            lineHeight: 1.6,
                        }}
                    >
                        Your order has been received and is being processed.
                        <br />
                        You'll receive a confirmation email shortly.
                    </Typography>

                    {/* Decorative Divider */}
                    <Box
                        sx={{
                            width: 80,
                            height: 3,
                            bgcolor: '#E5E7EB',
                            borderRadius: '2px',
                            mx: 'auto',
                            mb: 5,
                        }}
                    />

                    {/* Additional Info Cards */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                            mb: 5,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                bgcolor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '16px',
                                p: 3,
                            }}
                        >
                            <ShoppingBagIcon
                                sx={{
                                    fontSize: 32,
                                    color: '#111827',
                                    mb: 1.5,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    mb: 0.5,
                                }}
                            >
                                Order Confirmation
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    color: '#6B7280',
                                    lineHeight: 1.5,
                                }}
                            >
                                Check your email for order details and tracking information
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                bgcolor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '16px',
                                p: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    bgcolor: '#111827',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 1.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: '#FFFFFF',
                                    }}
                                >
                                    📦
                                </Typography>
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    mb: 0.5,
                                }}
                            >
                                Fast Delivery
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    color: '#6B7280',
                                    lineHeight: 1.5,
                                }}
                            >
                                Your items will be delivered within 3-5 business days
                            </Typography>
                        </Paper>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                            sx={{
                                height: 54,
                                px: 4,
                                background: 'linear-gradient(135deg, #000000 0%, #1F2937 100%)',
                                color: '#FFFFFF',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderRadius: '14px',
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                },
                                transition: 'all 200ms ease',
                            }}
                        >
                            Back to Home
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{
                                height: 54,
                                px: 4,
                                borderColor: '#E5E7EB',
                                color: '#111827',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderRadius: '14px',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#D1D5DB',
                                    bgcolor: '#F9FAFB',
                                },
                                transition: 'all 200ms ease',
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>

                    {/* Footer Note */}
                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: '#9CA3AF',
                            mt: 5,
                            lineHeight: 1.6,
                        }}
                    >
                        Need help? Contact our support team at{' '}
                        <Box
                            component="span"
                            sx={{
                                color: '#111827',
                                fontWeight: 600,
                            }}
                        >
                            support@techhub.com
                        </Box>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default OrderSuccessPage;

