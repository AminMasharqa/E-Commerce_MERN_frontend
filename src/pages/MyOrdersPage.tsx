import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Divider,
    Button,
    Avatar,
    Collapse,
    Alert,
    CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext';
import { BASE_URL } from '../constants/baseUrl';
import { formatPrice } from '../utils/cartHelpers';

interface OrderItem {
    productId: string;
    title: string;
    image: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    orderId: string;
    orderNumber: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError('You must be logged in to view orders');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/user/my-orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                
                // Transform backend data to match frontend Order interface
                const transformedOrders: Order[] = data.map((order: any) => ({
                    orderId: order._id,
                    orderNumber: order.orderNumber || `ORD-${order._id.slice(-8).toUpperCase()}`,
                    date: order.createdAt || order.date,
                    status: order.status || 'pending',
                    items: (order.orderItems || order.items || []).map((item: any) => ({
                        productId: item.productId || item._id,
                        title: item.productTitle || item.title || item.productName,
                        image: item.productImage || item.image,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice || item.price,
                    })),
                    subtotal: order.subtotal || (order.total * 0.85) || 0, // Estimate if not available
                    shipping: order.shipping || 0,
                    tax: order.tax || (order.total * 0.085) || 0, // Estimate if not available
                    total: order.total || order.totalAmount,
                }));

                setOrders(transformedOrders);
                setError(null);
            } catch (err) {
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' };
            case 'shipped':
                return { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' };
            case 'processing':
                return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
            case 'pending':
                return { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
            case 'cancelled':
                return { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' };
            default:
                return { bg: '#F3F4F6', color: '#374151', border: '#D1D5DB' };
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'delivered':
                return <CheckCircleIcon sx={{ fontSize: 18 }} />;
            case 'shipped':
                return <LocalShippingIcon sx={{ fontSize: 18 }} />;
            case 'processing':
            case 'pending':
                return <AccessTimeIcon sx={{ fontSize: 18 }} />;
            default:
                return null;
        }
    };

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress 
                        sx={{ 
                            color: '#111827',
                            mb: 2,
                        }} 
                    />
                    <Typography sx={{ color: '#6B7280', fontSize: '16px' }}>
                        Loading your orders...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
                <Container maxWidth="xl" sx={{ maxWidth: '1400px !important', px: { xs: 3, md: 7.5 }, py: { xs: 5, md: 10 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                        <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                            My Orders
                        </Typography>
                        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ color: '#111827', fontSize: '15px', fontWeight: 500, textTransform: 'none', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                            Back to Home
                        </Button>
                    </Box>
                    <Alert 
                        severity="error" 
                        sx={{ 
                            borderRadius: '16px',
                            '& .MuiAlert-message': {
                                fontSize: '15px',
                            }
                        }}
                    >
                        {error}
                    </Alert>
                </Container>
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh' }}>
                <Container maxWidth="xl" sx={{ maxWidth: '1400px !important', px: { xs: 3, md: 7.5 }, py: { xs: 5, md: 10 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                        <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                            My Orders
                        </Typography>
                        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ color: '#111827', fontSize: '15px', fontWeight: 500, textTransform: 'none', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                            Back to Home
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
                        <LocalMallIcon sx={{ fontSize: 120, color: '#E5E7EB', mb: 3 }} />
                        <Typography sx={{ fontSize: '28px', fontWeight: 600, color: '#111827', mb: 2 }}>No Orders Yet</Typography>
                        <Typography sx={{ fontSize: '16px', color: '#6B7280', mb: 4 }}>You haven't placed any orders yet</Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{
                                height: 48,
                                px: 4,
                                background: 'linear-gradient(135deg, #000000 0%, #1F2937 100%)',
                                color: '#FFFFFF',
                                fontSize: '15px',
                                fontWeight: 600,
                                borderRadius: '12px',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                },
                                transition: 'all 200ms ease',
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
            <Container maxWidth="xl" sx={{ maxWidth: '1400px !important', px: { xs: 3, md: 7.5 }, py: { xs: 5, md: 10 } }}>
                {/* Page Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Box>
                        <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2, mb: 0.5 }}>
                            My Orders
                        </Typography>
                        <Typography sx={{ fontSize: '16px', color: '#6B7280' }}>
                            View and track your orders
                        </Typography>
                    </Box>
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
                        Back to Home
                    </Button>
                </Box>

                {/* Orders List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {orders.map((order) => {
                        const statusStyle = getStatusColor(order.status);
                        const isExpanded = expandedOrder === order.orderId;

                        return (
                            <Paper
                                key={order.orderId}
                                elevation={0}
                                sx={{
                                    bgcolor: '#FFFFFF',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                                    transition: 'all 200ms ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                                    },
                                }}
                            >
                                {/* Order Header */}
                                <Box sx={{ p: 4, pb: 3 }}>
                                    <Grid container spacing={3} alignItems="center">
                                        {/* Order Number & Date */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Typography sx={{ fontSize: '13px', color: '#9CA3AF', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Order Number
                                            </Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                                                {order.orderNumber}
                                            </Typography>
                                            <Typography sx={{ fontSize: '14px', color: '#6B7280', mt: 0.5 }}>
                                                {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </Typography>
                                        </Grid>

                                        {/* Status */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Typography sx={{ fontSize: '13px', color: '#9CA3AF', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Status
                                            </Typography>
                                            <Chip
                                                {...(getStatusIcon(order.status) && { icon: getStatusIcon(order.status)! })}
                                                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                sx={{
                                                    bgcolor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    border: `1px solid ${statusStyle.border}`,
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    height: 32,
                                                    '& .MuiChip-icon': {
                                                        color: statusStyle.color,
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        {/* Total */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <Typography sx={{ fontSize: '13px', color: '#9CA3AF', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Total Amount
                                            </Typography>
                                            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                                                {formatPrice(order.total)}
                                            </Typography>
                                        </Grid>

                                        {/* Actions */}
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                onClick={() => toggleOrderExpansion(order.orderId)}
                                                sx={{
                                                    color: '#111827',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        bgcolor: '#F9FAFB',
                                                    },
                                                }}
                                            >
                                                {isExpanded ? 'Hide' : 'View'} Details
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Order Details (Expandable) */}
                                <Collapse in={isExpanded}>
                                    <Divider sx={{ borderColor: '#E5E7EB' }} />
                                    <Box sx={{ p: 4, bgcolor: '#F9FAFB' }}>
                                        {/* Order Items */}
                                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 3 }}>
                                            Order Items
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                            {order.items.map((item, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 3,
                                                        p: 2.5,
                                                        bgcolor: '#FFFFFF',
                                                        borderRadius: '12px',
                                                        border: '1px solid #E5E7EB',
                                                    }}
                                                >
                                                    <Avatar
                                                        src={item.image}
                                                        variant="rounded"
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: '10px',
                                                        }}
                                                    />
                                                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 0.5 }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
                                                                Quantity: {item.quantity}
                                                            </Typography>
                                                        </Box>
                                                        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                                                            {formatPrice(item.unitPrice * item.quantity)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* Order Summary */}
                                        <Box sx={{ maxWidth: 400, ml: 'auto', p: 3, bgcolor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827', mb: 2 }}>
                                                Order Summary
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>Subtotal</Typography>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                                                        {formatPrice(order.subtotal)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>Shipping</Typography>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: order.shipping === 0 ? '#10B981' : '#111827' }}>
                                                        {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>Tax</Typography>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                                                        {formatPrice(order.tax)}
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ my: 1, borderColor: '#E5E7EB' }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Total</Typography>
                                                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                                                        {formatPrice(order.total)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </Paper>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
};

export default MyOrdersPage;

