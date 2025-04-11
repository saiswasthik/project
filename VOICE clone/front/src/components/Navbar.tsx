import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MicIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Voice Clone
        </Typography>
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 