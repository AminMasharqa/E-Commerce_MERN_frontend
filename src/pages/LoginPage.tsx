import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { BASE_URL } from '../constants/baseUrl';
import { useAuth } from '../context/Auth/AuthContext';

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Get values from refs
    const email = emailRef.current?.value.trim().toLowerCase() || '';
    const password = passwordRef.current?.value || '';

    try {
      // Client-side validation
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Prepare login data
      const loginData = {
        email,
        password,
      };

      // Make API request
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      // Handle response
      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else if (response.status === 404) {
          setError('User not found. Please check your email or sign up.');
        } else if (response.status === 400) {
          setError(result.message || result.data || 'Invalid login credentials');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(result.message || result.data || 'Login failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setLoading(false);

      // Store token and login user
      if (result.data) {
        // Login through context (this will store in localStorage)
        login(email, result.data);

        // Optional: Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }

        // Clear form
        if (emailRef.current) emailRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid response from server. Please try again.');
        setLoading(false);
      }

    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  useState(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const shouldRemember = localStorage.getItem('rememberMe') === 'true';
    
    if (shouldRemember && rememberedEmail && emailRef.current) {
      emailRef.current.value = rememberedEmail;
      setRememberMe(true);
    }
  });

  return (
    <Container maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 5 }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        mx: 'auto', 
        borderRadius: 4,
        boxShadow: 3
      }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Grid container spacing={4} alignItems="center">
            {/* Image Section */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 1, lg: 1 } }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box
                  component="img"
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                  alt="Login"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>

            {/* Form Section */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 2 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="bold" 
                  sx={{ mb: 2, textAlign: 'center' }}
                >
                  Sign in
                </Typography>

                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 4, textAlign: 'center' }}
                >
                  Welcome back! Please sign in to your account
                </Typography>

                <Box 
                  component="form" 
                  onSubmit={handleSubmit}
                  sx={{ width: '100%', maxWidth: 500 }}
                >
                  {/* Error Alert */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <Alert 
                      icon={<LoginIcon fontSize="inherit" />} 
                      severity="success" 
                      sx={{ mb: 3 }}
                    >
                      Login successful! Redirecting... 🎉
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    inputRef={emailRef}
                    required
                    disabled={loading || success}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter your email"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    inputRef={passwordRef}
                    required
                    disabled={loading || success}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter your password"
                  />

                  {/* Remember Me & Forgot Password */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3 
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={loading || success}
                        />
                      }
                      label="Remember me"
                    />
                    <Typography
                      component="a"
                      href="#"
                      variant="body2"
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle forgot password - could open modal or navigate to forgot password page
                        alert('Forgot password functionality not implemented yet');
                      }}
                    >
                      Forgot password?
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || success}
                    startIcon={loading ? null : <LoginIcon />}
                    sx={{ mb: 3, py: 1.5 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        Signing in...
                      </>
                    ) : success ? (
                      'Redirecting...'
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Divider sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>

                  {/* Register Link */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Don't have an account?
                    </Typography>
                    <Button
                      component={Link}
                      to="/register"
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<PersonAddIcon />}
                      disabled={loading || success}
                      sx={{ py: 1.5 }}
                    >
                      Create New Account
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
