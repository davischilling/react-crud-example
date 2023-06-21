import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, color: 'white' }}>
        {children}
      </Container>
    </Box>
  );
}
