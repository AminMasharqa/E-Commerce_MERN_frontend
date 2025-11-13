import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    TextField,
    Divider,
    Alert,
    MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/Cart/CartContext';
import { useAuth } from '../context/Auth/AuthContext';
import { BASE_URL } from '../constants/baseUrl';
import {
    calculateSubtotal,
    calculateShipping,
    calculateTax,
    formatPrice,
} from '../utils/cartHelpers';

interface ShippingInfo {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

interface PaymentInfo {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });

    const [errors, setErrors] = useState<Partial<ShippingInfo & PaymentInfo>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState<string>('');

    const subtotal = calculateSubtotal(cartItems);
    const shipping = calculateShipping(subtotal);
    const tax = calculateTax(subtotal);
    const total = subtotal + shipping + tax;

    const handleShippingChange = (field: keyof ShippingInfo) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setShippingInfo({ ...shippingInfo, [field]: event.target.value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const handlePaymentChange = (field: keyof PaymentInfo) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value = event.target.value;

        if (field === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (value.length > 19) return;
        }

        if (field === 'expiryDate') {
            value = value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            if (value.length > 5) return;
        }

        if (field === 'cvv') {
            value = value.replace(/\D/g, '');
            if (value.length > 3) return;
        }

        setPaymentInfo({ ...paymentInfo, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ShippingInfo & PaymentInfo> = {};

        if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!shippingInfo.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
        if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
        if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
        if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';

        const cardNumberDigits = paymentInfo.cardNumber.replace(/\s/g, '');
        if (!cardNumberDigits) {
            newErrors.cardNumber = 'Card number is required';
        } else if (cardNumberDigits.length !== 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

        if (!paymentInfo.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
            newErrors.expiryDate = 'Invalid format (MM/YY)';
        }

        if (!paymentInfo.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (paymentInfo.cvv.length !== 3) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        setOrderError('');

        try {
            if (!token) {
                setOrderError('Authentication required. Please log in.');
                setIsProcessing(false);
                return;
            }

            // Create the full address string from shipping info
            const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`;

            const response = await fetch(`${BASE_URL}/cart/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    address: fullAddress
                })
            });

            const result = await response.json();

            if (!response.ok) {
                setOrderError(result.message || 'Failed to place order');
                setIsProcessing(false);
                return;
            }

            // Order placed successfully
            setIsProcessing(false);
            
            // Navigate to success page
            navigate('/order-success', { 
                state: { 
                    orderData: result.order,
                    message: result.message 
                } 
            });

            // Clear cart after successful order
            setTimeout(() => {
                clearCart();
            }, 100);

        } catch (error) {
            console.error('Error placing order:', error);
            setOrderError('Network error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
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
                        Checkout
                    </Typography>
                    <Button
                        variant="text"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/cart')}
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
                        Back to Cart
                    </Button>
                </Box>

                {/* Error Alert */}
                {orderError && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 4,
                            borderRadius: '12px',
                        }}
                    >
                        {orderError}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 6,
                    }}
                >
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 65%' } }}>
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '20px',
                                p: 4.5,
                                mb: 4,
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
                                <LocalShippingIcon sx={{ color: '#111827', fontSize: 28 }} />
                                <Typography
                                    sx={{
                                        fontSize: '24px',
                                        fontWeight: 600,
                                        color: '#111827',
                                    }}
                                >
                                    Shipping Information
                                </Typography>
                            </Box>

                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="First Name" value={shippingInfo.firstName} onChange={handleShippingChange('firstName')} error={!!errors.firstName} helperText={errors.firstName} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Last Name" value={shippingInfo.lastName} onChange={handleShippingChange('lastName')} error={!!errors.lastName} helperText={errors.lastName} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Email Address" type="email" value={shippingInfo.email} onChange={handleShippingChange('email')} error={!!errors.email} helperText={errors.email} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Street Address" value={shippingInfo.address} onChange={handleShippingChange('address')} error={!!errors.address} helperText={errors.address} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="City" value={shippingInfo.city} onChange={handleShippingChange('city')} error={!!errors.city} helperText={errors.city} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="State" value={shippingInfo.state} onChange={handleShippingChange('state')} error={!!errors.state} helperText={errors.state} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="ZIP Code" value={shippingInfo.zipCode} onChange={handleShippingChange('zipCode')} error={!!errors.zipCode} helperText={errors.zipCode} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth select label="Country" value={shippingInfo.country} onChange={handleShippingChange('country')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                        <MenuItem value="United States">United States</MenuItem>
                                        <MenuItem value="Canada">Canada</MenuItem>
                                        <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                                        <MenuItem value="Australia">Australia</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Phone Number" value={shippingInfo.phone} onChange={handleShippingChange('phone')} error={!!errors.phone} helperText={errors.phone} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '20px',
                                p: 4.5,
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
                                <PaymentIcon sx={{ color: '#111827', fontSize: 28 }} />
                                <Typography
                                    sx={{
                                        fontSize: '24px',
                                        fontWeight: 600,
                                        color: '#111827',
                                    }}
                                >
                                    Payment Information
                                </Typography>
                            </Box>

                            <Alert severity="info" icon={<LockIcon />} sx={{ mb: 3, borderRadius: '12px', bgcolor: '#F0F9FF', border: '1px solid #BAE6FD', '& .MuiAlert-icon': { color: '#0284C7' }, '& .MuiAlert-message': { color: '#075985' } }}>
                                Your payment information is secure and encrypted
                            </Alert>

                            <Grid container spacing={2.5}>
                                <Grid size={12}>
                                    <TextField fullWidth label="Card Number" value={paymentInfo.cardNumber} onChange={handlePaymentChange('cardNumber')} error={!!errors.cardNumber} helperText={errors.cardNumber} placeholder="1234 5678 9012 3456" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={12}>
                                    <TextField fullWidth label="Cardholder Name" value={paymentInfo.cardName} onChange={handlePaymentChange('cardName')} error={!!errors.cardName} helperText={errors.cardName} placeholder="John Doe" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Expiry Date" value={paymentInfo.expiryDate} onChange={handlePaymentChange('expiryDate')} error={!!errors.expiryDate} helperText={errors.expiryDate} placeholder="MM/YY" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="CVV" value={paymentInfo.cvv} onChange={handlePaymentChange('cvv')} error={!!errors.cvv} helperText={errors.cvv} placeholder="123" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>

                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' } }}>
                        <Paper elevation={0} sx={{ bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '20px', p: 4.5, position: 'sticky', top: 92, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#111827', mb: 3.5 }}>Order Summary</Typography>

                            <Box sx={{ mb: 3 }}>
                                {cartItems.slice(0, 3).map((item) => (
                                    <Box key={item.productId} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid #F3F4F6' }}>
                                        <Box sx={{ width: 60, height: 60, borderRadius: '10px', overflow: 'hidden', bgcolor: '#F9FAFB', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography>
                                            <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>Qty: {item.quantity}</Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{formatPrice(item.unitPrice * item.quantity)}</Typography>
                                    </Box>
                                ))}
                                {cartItems.length > 3 && (
                                    <Typography sx={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', mt: 1 }}>
                                        +{cartItems.length - 3} more item{cartItems.length - 3 > 1 ? 's' : ''}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 3, borderColor: '#E5E7EB' }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '15px', color: '#6B7280' }}>Subtotal ({cartItems.length} items)</Typography>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{formatPrice(subtotal)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '15px', color: '#6B7280' }}>Shipping</Typography>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 500, color: shipping === 0 ? '#10B981' : '#111827' }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '15px', color: '#6B7280' }}>Tax (8.5%)</Typography>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{formatPrice(tax)}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3, borderColor: '#E5E7EB' }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 4 }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Total</Typography>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{formatPrice(total)}</Typography>
                            </Box>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
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
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2.5 }}>
                                <LockIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                                <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>Secure checkout powered by SSL</Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
