"use client";
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const success = await login(name, email);
      if (success) {
        router.push("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (e) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Welcome to Dog Finder
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "#4081EC",
            "&:hover": {
              backgroundColor: "#3271d8",
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
