import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import type { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import AdbIcon from '@mui/icons-material/Adb';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/Auth/AuthContext';
import { useCart } from '../context/Cart/CartContext';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const { username, token, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState< null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting: string) => {
    handleCloseUserMenu();
    
    if (setting === 'Logout') {
      logout();
      navigate('/');
    } else if (setting === 'Profile') {
      // Navigate to profile page when implemented
      console.log('Profile clicked');
    } else if (setting === 'Account') {
      // Navigate to account settings when implemented  
      console.log('Account clicked');
    } else if (setting === 'Dashboard') {
      // Navigate to dashboard when implemented
      console.log('Dashboard clicked');
    }
  };

  const handleCart = () => {
    navigate('/cart');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" ,alignItems:"center" }}>
           <Button component={Link} to="/" color="inherit" >
            <Box sx={{ display: "flex", flexDirection: "row" ,alignItems:"center"}} >
              <AdbIcon sx={{ display: 'flex', mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                Tech Hub
              </Typography>

            </Box>
            </Button>


            <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              {/* Shopping Cart Badge - Always Visible */}
              <Tooltip title="Shopping Cart">
                <IconButton aria-label="cart" color="inherit" onClick={handleCart}>
                  <StyledBadge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </Tooltip>

              {token && username ? (
                // Authenticated User Menu
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem disabled>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Welcome, {username}
                      </Typography>
                    </MenuItem>
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                // Guest User Buttons
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    color="inherit"
                    startIcon={<PersonAddIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
