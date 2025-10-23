import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCart } from '../context/Cart/CartContext';

interface ProductCardProps {
  _id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
}

export default function ProductCard({ _id, title, image, price, stock }: ProductCardProps) {
  const { addItemToCart } = useCart();
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardMedia
        sx={{ height: 240, objectFit: 'cover' }}
        image={image}
        title={title}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#111827',
            fontSize: '24px',
          }}
        >
          ${price}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button 
          fullWidth 
          disabled={stock === 0}
          onClick={() => addItemToCart(_id)}
          sx={{
            height: 48,
            background: stock === 0 ? '#E5E7EB' : 'linear-gradient(135deg, #000000 0%, #1F2937 100%)',
            color: stock === 0 ? '#9CA3AF' : '#FFFFFF',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': {
              background: stock === 0 ? '#E5E7EB' : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
              transform: stock === 0 ? 'none' : 'translateY(-1px)',
              boxShadow: stock === 0 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)',
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
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
}
