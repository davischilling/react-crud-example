import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, color: "white" }}>
        {children}
      </Container>
    </Box>
  );
}
