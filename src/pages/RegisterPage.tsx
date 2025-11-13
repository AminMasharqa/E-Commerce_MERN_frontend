import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  
  Alert,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BASE_URL } from '../constants/baseUrl';
import { useAuth } from '../context/Auth/AuthContext';

const RegisterPage = () => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Get values from refs (move outside try block)
    const firstName = firstNameRef.current?.value.trim() || '';
    const lastName = lastNameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim().toLowerCase() || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    try {

      // Client-side validation
      if (!firstName || !lastName || !email || !password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Prepare form data
      const formData = {
        firstName,
        lastName,
        email,
        password,
      };

      console.log('Submitting registration:', { ...formData, password: '***' });

      // Make API request
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const token = await response.json();
      if(!token){
        setError('Server error. Please try again later.');
        setLoading(false);
        return;
      }
      console.log('Server response:', token);


      // Handle response
      if (!response.ok) {
        // Handle specific error messages
        if (response.status === 400) {
          if (typeof token.token === 'string' && token.data.toLowerCase().includes('already exists')) {
            setError('This email is already registered. Please use a different email or try logging in.');
          } else if (token.message) {
            setError(token.message);
          } else if (token.data) {
            setError(token.data);
          } else {
            setError('Invalid registration data. Please check your information.');
          }
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(token.message || token.data || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setLoading(false);
      
      // Store token if needed (assuming token.token contains JWT)
      if (token.data) {
        localStorage.setItem('token', token.data);
        console.log('JWT token stored');
        
        // Log in the user with the received token
        login(email, token.data);
      }

      // Clear form
      if (firstNameRef.current) firstNameRef.current.value = '';
      if (lastNameRef.current) lastNameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';

      // Optional: Redirect to login or dashboard after 2 seconds
      setTimeout(() => {
        // window.location.href = '/login'; // or use react-router
        console.log('Redirect to dashboard or login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

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
            {/* Form Section */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 2, lg: 1 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="bold" 
                  sx={{ mb: 5, mt: 2, textAlign: 'center' }}
                >
                  Sign up
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
                      icon={<CheckCircleIcon fontSize="inherit" />} 
                      severity="success" 
                      sx={{ mb: 3 }}
                    >
                      Registration successful! Welcome aboard! 🎉
                    </Alert>
                  )}

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        inputRef={firstNameRef}
                        required
                        disabled={loading || success}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        inputRef={lastNameRef}
                        required
                        disabled={loading || success}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Your Email"
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
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    inputRef={passwordRef}
                    required
                    disabled={loading || success}
                    helperText="Minimum 6 characters"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Repeat your password"
                    name="confirmPassword"
                    type="password"
                    inputRef={confirmPasswordRef}
                    required
                    disabled={loading || success}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || success}
                    sx={{ mb: 2, py: 1.5 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        Registering...
                      </>
                    ) : success ? (
                      'Registration Complete!'
                    ) : (
                      'Register'
                    )}
                  </Button>

                  <Typography variant="body2" textAlign="center" color="text.secondary">
                    Already have an account?{' '}
                    <Typography
                      component={Link}
                      to="/login"
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign in here
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Image Section */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ order: { xs: 1, lg: 2 } }}>
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
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  alt="Registration"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;