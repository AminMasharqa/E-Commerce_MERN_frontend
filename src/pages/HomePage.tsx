import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ProductCard from '../components/ProductCard';
import { BASE_URL } from '../constants/baseUrl';

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Error: {error}. Please make sure the backend server is running.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FAFAFA', minHeight: '100vh', py: 6 }}>
      <Container sx={{ mt: 2, mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          textAlign="center" 
          sx={{ 
            mb: 6,
            fontSize: '36px',
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.03em',
          }}
        >
          Our Products
        </Typography>
      
      {products.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No products available
        </Typography>
      ) : (
        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
        >
          {products.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProductCard {...product} />
            </Grid>
          ))}
        </Grid>
      )}
      </Container>
    </Box>
  );
};

export default HomePage;
